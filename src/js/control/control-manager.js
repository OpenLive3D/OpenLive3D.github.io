// global scene, light, and clock variable
let scene = new THREE.Scene();
let light = new THREE.DirectionalLight(0xffffff);
light.position.set(0.0, 1.0, -1.0).normalize();
scene.add(light);
let clock = new THREE.Clock();
clock.start();

// config
let Tvrmsbspn = THREE.VRMSchema.BlendShapePresetName;
let Tvrmshbn = THREE.VRMSchema.HumanoidBoneName;
let cm = getCM(); // required for ConfigManager Setup
let currentVrm = undefined;
let defaultXYZ = undefined;

// initialize / reinitialize VRM
function loadVRM(vrmurl){
    loadVRMModel(vrmurl,
        function(vrm){
            if(currentVrm){
                scene.remove(currentVrm.scene);
                currentVrm.dispose();
            }
            currentVrm = vrm;
            scene.add(vrm.scene);
            let head = currentVrm.humanoid.getBoneNode(Tvrmshbn.Head);
            let foot = currentVrm.humanoid.getBoneNode(Tvrmshbn.LeftFoot);
            let pos = {
                "x": head.up.x + head.position.x,
                "y": head.up.y + head.position.y - foot.position.y,
                "z": head.up.z + head.position.z
            };
            resetCameraPos(pos);
            resetVRMMood();
            createMoodLayout();
            let hips = currentVrm.humanoid.getBoneNode(Tvrmshbn.Hips).position;
            defaultXYZ = [hips.x, hips.y, hips.z];
            console.log("vrm model loaded");
            console.log(currentVrm);
        });
    setMood(getCMV('DEFAULT_MOOD'));
}

// initialize the control
function initialize(){

    // html canvas for drawing debug view
    createLayout();

    // start video
    startCamera(function(){
        linkCamera2Context(
            document.getElementById('dbg'),
            getCMV('CANVAS_RATIO'));
        createCameraLayout();
        console.log("video connected");
    });

    // load holistic
    loadHolistic(onHolisticResults, function(){
        console.log("holistic model connected");
    });

    // load vrm model
    loadVRM(getCMV('MODEL'));

    console.log("controller initialized");
}

function radLimit(rad){
    let limit = Math.PI / 2;
    return Math.max(-limit, Math.min(limit, rad));
}

function ratioLimit(ratio){
    return Math.max(0, Math.min(1, ratio));
}

function updateMouthEyes(keys){
    if(currentVrm && mood != Tvrmsbspn.Joy){
        let Cbsp = currentVrm.blendShapeProxy;
        let Ch = currentVrm.humanoid;
        // mouth
        let mouthRatio = ratioLimit((keys['mouth'] - getCMV("MOUTH_OPEN_OFFSET")) * getCMV('MOUTH_RATIO'));
        Cbsp.setValue(Tvrmsbspn.A, mouthRatio);
        // eyes
        let leo = keys['leftEyeOpen'];
        let reo = keys['rightEyeOpen'];
        if(getCMV("EYE_SYNC") || Math.abs(reo - leo) < getCMV('EYE_LINK_THRESHOLD')){
            let avgEye = (reo + leo) / 2;
            leo = avgEye;
            reo = avgEye;
        }
        if(reo < getCMV('RIGHT_EYE_CLOSE_THRESHOLD')){
            Cbsp.setValue(Tvrmsbspn.BlinkR, 1);
        }else if(reo < getCMV('RIGHT_EYE_OPEN_THRESHOLD')){
            let eRatio = (reo - getCMV('RIGHT_EYE_CLOSE_THRESHOLD')) / (getCMV('RIGHT_EYE_OPEN_THRESHOLD') - getCMV('RIGHT_EYE_CLOSE_THRESHOLD'));
            Cbsp.setValue(Tvrmsbspn.BlinkR, ratioLimit((1 - eRatio) * getCMV('RIGHT_EYE_SQUINT_RATIO')));
        }else{
            Cbsp.setValue(Tvrmsbspn.BlinkR, 0);
        }
        if(leo < getCMV('LEFT_EYE_CLOSE_THRESHOLD')){
            Cbsp.setValue(Tvrmsbspn.BlinkL, 1);
        }else if(leo < getCMV('LEFT_EYE_OPEN_THRESHOLD')){
            let eRatio = (leo - getCMV('LEFT_EYE_CLOSE_THRESHOLD')) / (getCMV('LEFT_EYE_OPEN_THRESHOLD') - getCMV('LEFT_EYE_CLOSE_THRESHOLD'));
            Cbsp.setValue(Tvrmsbspn.BlinkL, ratioLimit((1 - eRatio) * getCMV('LEFT_EYE_SQUINT_RATIO')));
        }else{
            Cbsp.setValue(Tvrmsbspn.BlinkL, 0);
        }
        // irises
        let irispos = keys['irisPos'];
        let irisY = (irispos - getCMV('IRIS_POS_OFFSET')) * getCMV('IRIS_POS_RATIO');
        let riris = Ch.getBoneNode(Tvrmshbn.RightEye).rotation;
        let liris = Ch.getBoneNode(Tvrmshbn.LeftEye).rotation;
        riris.y = irisY;
        liris.y = irisY;
        // eyebrows
        if(checkVRMMood("Brows up")){
            let browspos = Math.min(1, Math.max(0, keys['brows'] - getCMV("BROWS_OFFSET")) * getCMV("BROWS_RATIO"));
            Cbsp.setValue("Brows up", browspos);
        }
        // auto mood
        if(mood == "AUTO_MOOD_DETECTION"){
            let autoV = Math.max(-1, Math.min(1, keys["auto"] * getCMV("MOOD_AUTO_RATIO")));
            let absauto = Math.max(0, Math.abs(autoV) - getCMV("MOOD_AUTO_OFFSET"));
            let balFun = 0;
            let balSor = 0;
            let balAng = 0;
            if(!checkVRMMood("Brows up")){
                let browspos = Math.min(1, Math.max(0, keys['brows'] - getCMV("BROWS_OFFSET")) * getCMV("BROWS_RATIO"));
                let browslimit = 0.1;
                balFun = Math.min(browslimit, Math.max(0, browspos));
                balSor = Math.min(browslimit / 2, Math.max(0, (browslimit - balFun) / 2));
                balAng = Math.min(browslimit / 2, Math.max(0, (browslimit - balFun) / 2));
            }
            if(autoV < 0){
                Cbsp.setValue(Tvrmsbspn.Angry, balAng);
                Cbsp.setValue(Tvrmsbspn.Sorrow, absauto + balSor);
                Cbsp.setValue(Tvrmsbspn.Fun, balFun);
                Cbsp.setValue(Tvrmsbspn.E, 0);
            }else{
                Cbsp.setValue(Tvrmsbspn.Angry, balAng);
                Cbsp.setValue(Tvrmsbspn.Sorrow, balSor);
                Cbsp.setValue(Tvrmsbspn.Fun, absauto + balFun);
                Cbsp.setValue(Tvrmsbspn.E, absauto);
            }
        }
    }
}

function updateBody(keys){
    let updateTime = new Date().getTime();
    if(currentVrm){
        let Ch = currentVrm.humanoid;
        let tiltRatio = Math.min(0.2, Math.max(-0.2, keys['tilt']));
        let leanRatio = Math.min(1, Math.max(-1, keys['lean'])) * 0.6;
        // head
        let head = Ch.getBoneNode(Tvrmshbn.Head).rotation;
        head.set(radLimit(keys['pitch'] * getCMV('HEAD_RATIO')),
            radLimit(keys['yaw'] * getCMV('HEAD_RATIO') - leanRatio * 0.3),
            radLimit(keys['roll'] * getCMV('HEAD_RATIO') - tiltRatio * 0.3));
        // neck
        let neck = Ch.getBoneNode(Tvrmshbn.Neck).rotation;
        neck.set(radLimit(keys['pitch'] * getCMV('NECK_RATIO')),
            radLimit(keys['yaw'] * getCMV('NECK_RATIO') - leanRatio * 0.7),
            radLimit(keys['roll'] * getCMV('NECK_RATIO') - tiltRatio * 0.7));
        // chest
        let chest = Ch.getBoneNode(Tvrmshbn.Spine).rotation;
        chest.set(radLimit(keys['pitch'] * getCMV('CHEST_RATIO')),
            radLimit(keys['yaw'] * getCMV('CHEST_RATIO') + leanRatio),
            radLimit(keys['roll'] * getCMV('CHEST_RATIO') + tiltRatio));
        // left right arm
        if(getCMV('HAND_TRACKING')){
            for(let i = 0; i < 2; i ++){
                if(updateTime - handTrackers[i] < 1000 * getCMV('HAND_CHECK')){
                    let prefix = ["left", "right"][i];
                    let lrRatio = 1 - i * 2;
                    // upperArm, lowerArm
                    let wx = keys[prefix + "WristX"];
                    let wy = keys[prefix + "WristY"];
                    let wz = keys[prefix + "WristZ"];
                    let armRotate = armMagic(wx, wy, wz, i);
                    let nq = new THREE.Quaternion();
                    Object.keys(armRotate).forEach(function(armkey){
                        let armobj = Ch.getBoneNode(prefix + armkey).rotation;
                        nq.multiply(new THREE.Quaternion().setFromEuler(armobj));
                        armobj.set(...armRotate[armkey]);
                    });
                    nq.invert();
                    let de = new THREE.Euler(0, -Math.PI/2*lrRatio, -Math.PI/2*lrRatio);
                    nq.multiply(new THREE.Quaternion().setFromEuler(de));
                    let he = new THREE.Euler(-keys[prefix + 'Yaw']*lrRatio, keys[prefix + 'Roll'], -keys[prefix + 'Pitch']*lrRatio);
                    nq.multiply(new THREE.Quaternion().setFromEuler(he));
                    let ne = new THREE.Euler().setFromQuaternion(nq);
                    let handobj = Ch.getBoneNode(prefix + "Hand").rotation;
                    handobj.copy(ne);
                }else{
                    setDefaultHand(currentVrm, i);
                }
            }
        }else{
            setDefaultPose(currentVrm);
        }
    }
}

function updatePosition(keys){
    if(currentVrm && defaultXYZ){
        let Ch = currentVrm.humanoid;
        let hips = Ch.getBoneNode(Tvrmshbn.Hips).position;
        hips.x = defaultXYZ[0] - keys['x'] * getCMV("POSITION_X_RATIO");
        hips.y = defaultXYZ[1] - keys['y'] * getCMV("POSITION_Y_RATIO");
        hips.z = defaultXYZ[2] + keys['z'] * getCMV("POSITION_Z_RATIO");
    }
}

function updateBreath(){
    if(currentVrm){
        let Ch = currentVrm.humanoid;
        // breath offset
        let bos = getCMV("BREATH_STRENGTH") / 100 * Math.sin(clock.elapsedTime * Math.PI * getCMV('BREATH_FREQUENCY'));
        if(isNaN(bos)){
            bos = 0.0;
        }
        // hips
        let hips = Ch.getBoneNode(Tvrmshbn.Hips).position;
        hips.y += bos;
    }
}

function updateMood(){
    if(mood != oldmood){
        console.log(mood, oldmood);
        let Cbsp = currentVrm.blendShapeProxy;
        if(oldmood != "AUTO_MOOD_DETECTION"){
            Cbsp.setValue(oldmood, 0);
        }else{
            Cbsp.setValue(Tvrmsbspn.Angry, 0);
            Cbsp.setValue(Tvrmsbspn.Sorrow, 0);
            Cbsp.setValue(Tvrmsbspn.Fun, 0);
            Cbsp.setValue(Tvrmsbspn.E, 0);
        }
        if(mood != "AUTO_MOOD_DETECTION"){
            Cbsp.setValue(mood, 1);
        }
        oldmood = mood;
    }
}

function updateInfo(){
    let info = getInfo();
    updateBody(info);
    updatePosition(info);
    updateBreath();
    updateMood();
}

// Mood
let defaultMoodList = ['angry', 'sorrow', 'fun', 'joy', 'surprised', 'relaxed', 'neutral', 'auto'];
let moodMap = {
    "angry": Tvrmsbspn.Angry,
    "sorrow": Tvrmsbspn.Sorrow,
    "fun": Tvrmsbspn.Fun,
    "joy": Tvrmsbspn.Joy,
    "surprised": "Surprised",
    "relaxed": "Relaxed",
    "neutral": Tvrmsbspn.Neutral,
    "auto": "AUTO_MOOD_DETECTION"
};
let mood = Tvrmsbspn.Neutral;
let oldmood = Tvrmsbspn.Neutral;
function getAllMoods(){
    let validmoods = [];
    Object.keys(moodMap).forEach(function(key){
        if(defaultMoodList.includes(key)){
            if(getCMV("MOOD_" + key.toUpperCase())){
                validmoods.push(key);
            }
        }
    });
    Object.keys(moodMap).forEach(function(key){
        if(!defaultMoodList.includes(key)){
            validmoods.push(key);
        }
    });
    return validmoods;
}
function getMood(){
    return mood;
}
function setMood(newmood){
    oldmood = mood;
    mood = moodMap[newmood];
}

// face landmark resolver
function onFaceLandmarkResult(keyPoints, faceInfo){
    if(faceInfo){
        Object.keys(faceInfo).forEach(function(key){
            let sr = getSR(getKeyType(key)) / getCMV("SENSITIVITY_SCALE");
            tmpInfo[key] = (1-sr) * faceInfo[key] + sr * tmpInfo[key];
        });
        updateMouthEyes(tmpInfo);
    }
}

// pose landmark resolver
function onPoseLandmarkResult(keyPoints, poseInfo){
    if(poseInfo){
        Object.keys(poseInfo).forEach(function(key){
            let sr = getSR(getKeyType(key)) / getCMV("SENSITIVITY_SCALE");
            tmpInfo[key] = (1-sr) * poseInfo[key] + sr * tmpInfo[key];
        });
    }
}

// hand landmark resolver
let fingerRates = {"Thumb": 0.8, "Index": 0.7, "Middle": 0.7, "Ring": 0.7, "Little": 0.6};
let spreadRates = {"Index": -30, "Middle": -10, "Ring": 10, "Little": 30};
let fingerSegs = ["Distal", "Intermediate", "Proximal"];
let thumbRatios = [40, 60, 20];
let thumbSwing = 20;
let handTrackers = [new Date().getTime(), new Date().getTime()];
function onHandLandmarkResult(keyPoints, handInfo, leftright){
    let prefix = ["left", "right"][leftright];
    let preRate = 1 - leftright * 2;
    if(handInfo){
        handTrackers[leftright] = new Date().getTime();
        Object.keys(handInfo).forEach(function(key){
            let sr = getSR('hand') / getCMV("SENSITIVITY_SCALE");
            if(key in tmpInfo){
                tmpInfo[key] = (1-sr) * handInfo[key] + sr * tmpInfo[key];
            }
        });
        let Ch = currentVrm.humanoid;
        Object.keys(fingerRates).forEach(function(finger){
            let fingerRate = fingerRates[finger] * getCMV("FINGER_GRIP_RATIO");
            let spreadRate = spreadRates[finger] * getCMV("FINGER_SPREAD_RATIO");
            let preRatio = tmpInfo[prefix + finger];
            let _ratio = 1 - Math.max(0, Math.min(fingerRate, preRatio)) / fingerRate;
            let preSpread = tmpInfo[prefix + "Spread"];
            if(preRatio < 0){
                preSpread = 0.1;
            }
            let _spread = Math.min(1, Math.max(-0.2, preSpread - 0.1)) * spreadRate;
            if(finger == "Thumb"){
                for(let i = 0; i < fingerSegs.length; i ++){
                    let seg = fingerSegs[i];
                    let ratio = preRate * _ratio * thumbRatios[i] / 180 * Math.PI;
                    let swing = preRate * (0.5 - Math.abs(0.5 - _ratio)) * thumbSwing / 180 * Math.PI;
                    let frotate = Ch.getBoneNode(prefix + finger + seg).rotation;
                    frotate.set(0, ratio, swing);
                }
            }else{
                let ratio = preRate * _ratio * 70 / 180 * Math.PI;
                let spread = preRate * _spread / 180 * Math.PI;
                for(seg of fingerSegs){
                    let frotate = Ch.getBoneNode(prefix + finger + seg).rotation;
                    if(seg == "Proximal"){
                        frotate.set(0, spread, ratio);
                    }else{
                        frotate.set(0, 0, ratio);
                    }
                }
            }
        });
    }
}
function noHandLandmarkResult(leftright){
    let prefix = ["left", "right"][leftright];
    let tmpHandInfo = getDefaultHandInto(leftright);
    Object.keys(tmpHandInfo).forEach(function(key){
        let sr = getSR(getKeyType(key));
        if(key in tmpInfo){
            tmpInfo[key] = (1-sr) * tmpHandInfo[key] + sr * tmpInfo[key];
        }
    });
    let Ch = currentVrm.humanoid;
    Object.keys(fingerRates).forEach(function(finger){
        for(seg of fingerSegs){
            let frotate = Ch.getBoneNode(prefix + finger + seg).rotation;
            frotate.set(frotate.x * 0.8, frotate.y * 0.8, frotate.z * 0.8);
        }
    });
}

// obtain Holistic Result
let firstTime = true;
let tween = null;
let tmpInfo = getDefaultInfo();
async function onHolisticResults(results){
    let updateTime = new Date().getTime();
    if(firstTime){
        hideLoadbox();
        setInterval(checkFPS, 1000 * getCMV("FPS_RATE"));
        console.log("ml & visual loops validated");
        console.log("1st Result: ", results);
    }

    clearDebugCvs();
    if(getCMV('DEBUG_IMAGE')){
        drawImage(getCameraFrame());
    }

    let PoI = {};
    let allInfo = {};
    if(results.faceLandmarks){
        let keyPoints = packFaceHolistic(results.faceLandmarks);
        mergePoints(PoI, keyPoints);
        let faceInfo = face2Info(keyPoints);
        allInfo["face"] = faceInfo;
        onFaceLandmarkResult(keyPoints, faceInfo);
    }
    if(results.poseLandmarks){
        let keyPoints = packPoseHolistic(results.poseLandmarks);
        mergePoints(PoI, keyPoints);
        let poseInfo = pose2Info(keyPoints);
        allInfo["pose"] = poseInfo;
        onPoseLandmarkResult(keyPoints, poseInfo);
    }
    if(results.leftHandLandmarks){
        let keyPoints = packHandHolistic(results.leftHandLandmarks, 0);
        mergePoints(PoI, keyPoints);
        let handInfo = hand2Info(keyPoints, 0);
        allInfo["left_hand"] = handInfo;
        onHandLandmarkResult(keyPoints, handInfo, 0);
    }else if(updateTime - handTrackers[0] > 1000 * getCMV('HAND_CHECK')){
        noHandLandmarkResult(0);
    }
    if(results.rightHandLandmarks){
        let keyPoints = packHandHolistic(results.rightHandLandmarks, 1);
        mergePoints(PoI, keyPoints);
        let handInfo = hand2Info(keyPoints, 1);
        allInfo["right_hand"] = handInfo;
        onHandLandmarkResult(keyPoints, handInfo, 1);
    }else if(updateTime - handTrackers[1] > 1000 * getCMV('HAND_CHECK')){
        noHandLandmarkResult(1);
    }

    printLog(allInfo);
    if(getCMV('DEBUG_LANDMARK')){
        drawLandmark(PoI);
    }
    if(results.faceLandmarks){
        pushInfo(tmpInfo);
    }
    firstTime = false;
    setTimeout(function(){
        mlLoop();
    }, 100);
}

// the main ML loop
let mlLoopCounter = 0;
async function mlLoop(){
    mlLoopCounter += 1;
    let hModel = getHolisticModel();
    if(checkImage()){
        await hModel.send({image: getCameraFrame()});
    }else{
        setTimeout(function(){
            mlLoop();
        }, 500);
    }
}

// the main visualization loop
let viLoopCounter = 0;
async function viLoop(){
    viLoopCounter += 1;
    if(currentVrm){
        currentVrm.update(clock.getDelta());
        updateInfo();
        drawScene(scene);
    }
    requestAnimationFrame(viLoop);
}

// mood check
let noMoods = [];
function resetVRMMood(){
    noMoods = [];
    Object.keys(moodMap).forEach(function(i){
        if(!(defaultMoodList.includes(i))){
            delete moodMap[i];
        }
    });
    if(currentVrm){
        let defaultMoodLength = defaultMoodList.length;
        let unknownMood = currentVrm.blendShapeProxy._unknownGroupNames;
        for(let newmood of unknownMood){
            let newmoodid = Object.keys(moodMap).length - defaultMoodLength + 1;
            if(!Object.values(moodMap).includes(newmood)){
                if(newmoodid <= getCMV("MOOD_EXTRA_LIMIT")){
                    moodMap[newmoodid.toString()] = newmood;
                }
            }
        }
    }
}
function checkVRMMood(mood){
    if(mood == "auto"){
        return true;
    }else if(noMoods.includes(mood)){
        return false;
    }else if(currentVrm){
        let tmood = moodMap[mood];
        if(currentVrm.blendShapeProxy.getBlendShapeTrackName(tmood)){
            return true;
        }else if(currentVrm.blendShapeProxy.getBlendShapeTrackName(mood)){
            return true;
        }else{
            noMoods.push(mood);
            return false;
        }
    }else{
        return false;
    }
}

// integration check
async function checkIntegrate(){
    drawLoading("⟳ Integration Validating...");
    let image = getCameraFrame();
    let hModel = getHolisticModel();
    await hModel.send({image: getCameraFrame()});
    requestAnimationFrame(viLoop);
    requestAnimationFrame(mlLoop);
    console.log("ml & visual loops initialized");
}

// check VRM model
function checkVRMModel(){
    if(currentVrm){
        return true;
    }else{
        return false;
    }
}

// initialization loop
function initLoop(){
    if(window.mobileCheck()){
        drawMobile();
    }else{
        drawLoading("Initializing");
        if(checkVRMModel() && checkHModel() && checkImage()){
            console.log("start integration validation");
            checkIntegrate();
        }else{
            requestAnimationFrame(initLoop);
        }
    }
}

// validate counter
function prettyNumber(n){
    return Math.floor(n * 1000) / 1000;
}
function checkFPS(){
    console.log("FPS: ",
        prettyNumber(viLoopCounter / getCMV("FPS_RATE")),
        prettyNumber(mlLoopCounter / getCMV("FPS_RATE")));
    viLoopCounter = 0;
    mlLoopCounter = 0;
}
