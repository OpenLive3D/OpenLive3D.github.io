// global scene, light, and clock variable
let scene = new THREE.Scene();
let light = new THREE.DirectionalLight(0xffffff);
light.position.set(0.0, 1.0, -1.0).normalize();
scene.add(light);
let clock = new THREE.Clock();
clock.start();

// config
let Tvrmsbspn = THREE_VRM.VRMExpressionPresetName;
let Tvrmshbn = THREE_VRM.VRMHumanBoneName;
let currentVrm = undefined;
let defaultXYZ = undefined;
let metadata = {"key": 0, "time": 0};

// initialize / reinitialize VRM
function loadVRM(vrmurl){
    loadVRMModel(vrmurl,
        function(vrm){
            if(currentVrm){
                scene.remove(currentVrm.scene);
                THREE_VRM.VRMUtils.deepDispose(currentVrm.scene);
            }
            currentVrm = vrm;
            scene.add(vrm.scene);
            let head = currentVrm.humanoid.getNormalizedBoneNode(Tvrmshbn.Head);
            let foot = currentVrm.humanoid.getNormalizedBoneNode(Tvrmshbn.LeftFoot);
            let pos = {
                "x": head.up.x + head.position.x,
                "y": head.up.y + head.position.y - foot.position.y,
                "z": head.up.z + head.position.z
            };
            resetCameraPos(pos);
            resetVRMMood();
            createMoodLayout();
            let hips = currentVrm.humanoid.getNormalizedBoneNode(Tvrmshbn.Hips).position;
            defaultXYZ = [hips.x, hips.y, hips.z];
            console.log("vrm model loaded");
            console.log(currentVrm);
        }, function(){
            if(vrmurl != getCMV('MODEL')){
                loadVRM(getCMV('MODEL'));
            }else if(vrmurl != getCMV('DEFAULT_MODEL')){
                setCMV('MODEL', getCMV('DEFAULT_MODEL'));
                loadVRM(getCMV('DEFAULT_MODEL'));
            }
        });
    setMood(getCMV('DEFAULT_MOOD'));
    setLogAPI();
}

// initialize the control
function initialize(){
    initConfig();

    // html canvas for drawing debug view
    createLayout();

    // start video
    startCamera(setCameraCallBack);

    // // load holistic
    loadMLModels(onWorkerResults, function(){
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
    if(currentVrm && mood != Tvrmsbspn.Happy && mood != "Extra"){
        let Cbsp = currentVrm.expressionManager;
        let Ch = currentVrm.humanoid;
        // mouth
        let mouthRatio = ratioLimit((keys['mouth'] - getCMV("MOUTH_OPEN_OFFSET")) * getCMV('MOUTH_RATIO'));
        Cbsp.setValue(Tvrmsbspn.Aa, mouthRatio);
        // eyes
        let leo = keys['leftEyeOpen'];
        let reo = keys['rightEyeOpen'];
        if(getCMV("EYE_SYNC") || Math.abs(reo - leo) < getCMV('EYE_LINK_THRESHOLD')){
            let avgEye = (reo + leo) / 2;
            leo = avgEye;
            reo = avgEye;
        }
        if(reo < getCMV('RIGHT_EYE_CLOSE_THRESHOLD')){
            Cbsp.setValue(Tvrmsbspn.BlinkRight, 1);
        }else if(reo < getCMV('RIGHT_EYE_OPEN_THRESHOLD')){
            let eRatio = (reo - getCMV('RIGHT_EYE_CLOSE_THRESHOLD')) / (getCMV('RIGHT_EYE_OPEN_THRESHOLD') - getCMV('RIGHT_EYE_CLOSE_THRESHOLD'));
            Cbsp.setValue(Tvrmsbspn.BlinkRight, ratioLimit((1 - eRatio) * getCMV('RIGHT_EYE_SQUINT_RATIO')));
        }else{
            Cbsp.setValue(Tvrmsbspn.BlinkRight, 0);
        }
        if(leo < getCMV('LEFT_EYE_CLOSE_THRESHOLD')){
            Cbsp.setValue(Tvrmsbspn.BlinkLeft, 1);
        }else if(leo < getCMV('LEFT_EYE_OPEN_THRESHOLD')){
            let eRatio = (leo - getCMV('LEFT_EYE_CLOSE_THRESHOLD')) / (getCMV('LEFT_EYE_OPEN_THRESHOLD') - getCMV('LEFT_EYE_CLOSE_THRESHOLD'));
            Cbsp.setValue(Tvrmsbspn.BlinkLeft, ratioLimit((1 - eRatio) * getCMV('LEFT_EYE_SQUINT_RATIO')));
        }else{
            Cbsp.setValue(Tvrmsbspn.BlinkLeft, 0);
        }
        // irises
        let irispos = keys['irisPos'];
        let irisY = (irispos - getCMV('IRIS_POS_OFFSET')) * getCMV('IRIS_POS_RATIO');
        let riris = Ch.getNormalizedBoneNode(Tvrmshbn.RightEye).rotation;
        let liris = Ch.getNormalizedBoneNode(Tvrmshbn.LeftEye).rotation;
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
                Cbsp.setValue(Tvrmsbspn.Sad, absauto + balSor);
                Cbsp.setValue(Tvrmsbspn.Happy, balFun);
                Cbsp.setValue(Tvrmsbspn.Ee, 0);
            }else{
                Cbsp.setValue(Tvrmsbspn.Angry, balAng);
                Cbsp.setValue(Tvrmsbspn.Sad, balSor);
                Cbsp.setValue(Tvrmsbspn.Happy, absauto + balFun);
                Cbsp.setValue(Tvrmsbspn.Ee, absauto);
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
        let head = Ch.getNormalizedBoneNode(Tvrmshbn.Head).rotation;
        head.set(radLimit(keys['pitch'] * getCMV('HEAD_RATIO')),
            radLimit(keys['yaw'] * getCMV('HEAD_RATIO') - leanRatio * 0.3),
            radLimit(keys['roll'] * getCMV('HEAD_RATIO') - tiltRatio * 0.3));
        // neck
        let neck = Ch.getNormalizedBoneNode(Tvrmshbn.Neck).rotation;
        neck.set(radLimit(keys['pitch'] * getCMV('NECK_RATIO')),
            radLimit(keys['yaw'] * getCMV('NECK_RATIO') - leanRatio * 0.7),
            radLimit(keys['roll'] * getCMV('NECK_RATIO') - tiltRatio * 0.7));
        // chest
        let chest = Ch.getNormalizedBoneNode(Tvrmshbn.Spine).rotation;
        chest.set(radLimit(keys['pitch'] * getCMV('CHEST_RATIO')),
            radLimit(keys['yaw'] * getCMV('CHEST_RATIO') + leanRatio),
            radLimit(keys['roll'] * getCMV('CHEST_RATIO') + tiltRatio));
        // left right arm
        if(getCMV('HAND_TRACKING')){
            for(let i = 0; i < 2; i ++){
                if(updateTime - handTrackers[i] < 1000 * getCMV('HAND_CHECK')){
                    let prefix = ["left", "right"][i];
                    // upperArm, lowerArm
                    let wx = keys[prefix + "WristX"] + keys["x"] * getCMV("HEAD_HAND_RATIO");
                    let wy = keys[prefix + "WristY"];
                    let hy = keys[prefix + 'Yaw'];
                    let hr = keys[prefix + 'Roll'];
                    let hp = keys[prefix + 'Pitch'];
                    let armEuler = armMagicEuler(wx, wy, hy, hr, hp, i);
                    Object.keys(armEuler).forEach(function(armkey){
                        let armobj = Ch.getNormalizedBoneNode(prefix + armkey).rotation;
                        armobj.copy(armEuler[armkey]);
                    });
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
        let hips = Ch.getNormalizedBoneNode(Tvrmshbn.Hips).position;
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
        let hips = Ch.getNormalizedBoneNode(Tvrmshbn.Hips).position;
        hips.y += bos;
    }
}

function updateMood(){
    if(mood != oldmood){
        console.log(mood, oldmood);
        let Cbsp = currentVrm.expressionManager;
        if(oldmood != "AUTO_MOOD_DETECTION"){
            Cbsp.setValue(oldmood, 0);
        }else{
            Cbsp.setValue(Tvrmsbspn.Angry, 0);
            Cbsp.setValue(Tvrmsbspn.Sad, 0);
            Cbsp.setValue(Tvrmsbspn.Happy, 0);
            Cbsp.setValue(Tvrmsbspn.Ee, 0);
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
    "sorrow": Tvrmsbspn.Sad,
    "fun": Tvrmsbspn.Happy,
    "surprised": "Surprised",
    "relaxed": Tvrmsbspn.Relaxed,
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
let thumbSegs = ["Distal", "Metacarpal", "Proximal"];
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
                for(let i = 0; i < thumbSegs.length; i ++){
                    let seg = thumbSegs[i];
                    let ratio = preRate * _ratio * thumbRatios[i] / 180 * Math.PI;
                    let swing = preRate * (0.5 - Math.abs(0.5 - _ratio)) * thumbSwing / 180 * Math.PI;
                    let frotate = Ch.getNormalizedBoneNode(prefix + finger + seg).rotation;
                    frotate.set(0, ratio, swing);
                }
            }else{
                let ratio = preRate * _ratio * 70 / 180 * Math.PI;
                let spread = preRate * _spread / 180 * Math.PI;
                for(seg of fingerSegs){
                    let frotate = Ch.getNormalizedBoneNode(prefix + finger + seg).rotation;
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
        if(finger == "Thumb"){
            for(seg of thumbSegs){
                let frotate = Ch.getNormalizedBoneNode(prefix + finger + seg).rotation;
                frotate.set(frotate.x * 0.8, frotate.y * 0.8, frotate.z * 0.8);
            }
        }else{
            for(seg of fingerSegs){
                let frotate = Ch.getNormalizedBoneNode(prefix + finger + seg).rotation;
                frotate.set(frotate.x * 0.8, frotate.y * 0.8, frotate.z * 0.8);
            }
        }
    });
}

async function postImage(){
    getMLModel(getCMV("HAND_TRACKING")).postMessage({
        "metakey": metadata["key"],
        "image": getCaptureImage()
    });
}

// obtain Holistic Result
let firstTime = true;
let tmpInfo = getDefaultInfo();
let mlLoopCounter = 0;
let dynamicMLDura = getCMV("MIN_ML_DURATION");
async function onWorkerResults(e){
    if(e.data && e.data['results']){
        mlLoopCounter += 1;
        onHolisticResults(e.data['results']);
    }
    if(e.data && e.data['metakey'] == metadata["key"]){
        try{
            correctMeta();
            setTimeout(function(){
                postImage();
            }, dynamicMLDura);
        }
        catch(err){
            console.log(err);
        }
    }
}

async function onHolisticResults(results){
    let updateTime = new Date().getTime();
    if(firstTime){
        correctMeta();
        hideLoadbox();
        setInterval(checkHealth, 1000 * getCMV("HEALTH_RATE"));
        console.log("ml & visual loops validated");
        console.log("1st Result: ", results);
    }

    clearDebugCvs();
    if(getCMV('DEBUG_IMAGE')){
        drawImage(getCameraFrame());
    }

    let PoI = {};
    let allInfo = {"general": {"3D-FPS": 0, "ML-FPS": 0}};
    if(viFPSQueue.length > 0){
        allInfo["general"]["3D-FPS"] = viFPSQueue[viFPSQueue.length - 1];
    }
    if(mlFPSQueue.length > 0){
        allInfo["general"]["ML-FPS"] = mlFPSQueue[mlFPSQueue.length - 1];
    }
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
}

// the main visualization loop
let viLoopCounter = 0;
let dynamicVIDura = getCMV("MIN_VI_DURATION");
async function viLoop(){
    if(currentVrm && checkImage()){
        viLoopCounter += 1;
        currentVrm.update(clock.getDelta());
        updateInfo();
        drawScene(scene);
        setTimeout(function(){
            requestAnimationFrame(viLoop);
        }, dynamicVIDura);
    }else{
        setTimeout(function(){
            requestAnimationFrame(viLoop);
        }, getCMV("MAX_VI_DURATION"));
    }
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
        let defaultMoodLength = Object.keys(moodMap).length;
        for(tmood of currentVrm.expressionManager.blinkExpressionNames){
            noMoods.push(tmood);
        }
        for(tmood of currentVrm.expressionManager.lookAtExpressionNames){
            noMoods.push(tmood);
        }
        for(tmood of currentVrm.expressionManager.mouthExpressionNames){
            noMoods.push(tmood);
        }
        let unknownMood = currentVrm.expressionManager._expressionMap;
        Object.keys(unknownMood).forEach(function(newmood){
            if(!noMoods.includes(newmood)){
                let newmoodid = Object.keys(moodMap).length - defaultMoodLength;
                if(!Object.values(moodMap).includes(newmood)){
                    if(newmoodid < getCMV("MOOD_EXTRA_LIMIT")){
                        moodMap[newmoodid.toString()] = newmood;
                    }
                }
            }
        });
    }
}
function checkVRMMood(mood){
    if(mood == "auto"){
        return true;
    }else if(noMoods.includes(mood)){
        return false;
    }else if(currentVrm){
        let tmood = moodMap[mood];
        if(currentVrm.expressionManager.getExpressionTrackName(tmood)){
            return true;
        }else if(currentVrm.expressionManager.getExpressionTrackName(mood)){
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
    setNewMeta();
    postImage();
    requestAnimationFrame(viLoop);
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
    }else if(window.browserCheck() == "Safari"){
        drawSafari();
    }else{
        drawLoading("Initializing");
        if(checkVRMModel() && checkMLModel() && checkImage()){
            console.log("start integration validation");
            checkIntegrate();
        }else{
            requestAnimationFrame(initLoop);
        }
    }
}

// validate counter
let viFPS = 0.0;
let mlFPS = 0.0;
let viFPSQueue = [];
let mlFPSQueue = [];
let viHealthQueue = [];
let mlHealthQueue = [];
let viHealthState = 0;
let mlHealthState = 0;
function prettyNumber(n){
    return Math.floor(n * 1000) / 1000;
}

// healthcheck metadata
function setNewMeta(){
    metadata["key"] = Date.now();
    metadata["time"] = metadata["key"];
    console.log("set new metadata:", metadata);
}
function correctMeta(){
    metadata["time"] = Date.now();
}
function checkMLHealthQueue(state){
    let healthCount = 0;
    for(let i = 0; i < getCMV("FPS_WAIT"); i++){
        if(mlHealthQueue[i] == state){
            healthCount += 1;
        }
    }
    if(healthCount == getCMV("FPS_WAIT")){
        if(state == 1 && getCMV("HAND_TRACKING")){
            console.log("ALERT: Ultra Fast");
        }else if(state == 2){
            console.log("ALERT: Hardware Acceleration");
        }else if(state == 3){
            console.log("ALERT: Error");
        }
        mlHealthState = state;
        raiseAlert(viHealthState, mlHealthState);
    }
}
function checkVIHealthQueue(state){
    let healthCount = 0;
    for(let i = 0; i < getCMV("FPS_WAIT"); i++){
        if(viHealthQueue[i] == state){
            healthCount += 1;
        }
    }
    if(healthCount == getCMV("FPS_WAIT")){
        if(state == 1){
            console.log("ALERT: Slow");
        }else if(state == 2){
            console.log("ALERT: Hardware Acceleration");
        }else if(state == 3){
            console.log("ALERT: Full Screen / Wrong Tab");
        }
        viHealthState = state;
        raiseAlert(viHealthState, mlHealthState);
    }
}
function checkHealth(){
    viFPS = viLoopCounter / getCMV("HEALTH_RATE");
    mlFPS = mlLoopCounter / getCMV("HEALTH_RATE");
    dynamicMLDura *= (mlFPS / getCMV("ML_FPS_LIMIT"));
    dynamicMLDura = Math.max(dynamicMLDura, getCMV("MIN_ML_DURATION"));
    dynamicMLDura = Math.min(dynamicMLDura, getCMV("MAX_ML_DURATION"));
    dynamicVIDura *= (viFPS / getCMV("3D_FPS_LIMIT"));
    dynamicVIDura = Math.max(dynamicVIDura, getCMV("MIN_VI_DURATION"));
    dynamicVIDura = Math.min(dynamicVIDura, getCMV("MAX_VI_DURATION"));
    viLoopCounter = 0;
    mlLoopCounter = 0;
    viFPSQueue.push(viFPS);
    mlFPSQueue.push(mlFPS);
    if(mlHealthQueue.length == getCMV("FPS_WAIT")){
        mlHealthQueue.shift();
    }
    if(mlFPS > 15){
        mlHealthQueue.shift();
        if(mlHealthQueue.length == 0){
            mlHealthState = 0;
            clearAlert(viHealthState, mlHealthState);
        }
    }else{
        let state = 3;
        if(mlFPS > 5){
            state = 1;
        }else if(mlFPS > 0){
            state = 2;
        }
        mlHealthQueue.push(state);
        if(mlHealthQueue.length == getCMV("FPS_WAIT")){
            checkMLHealthQueue(state);
        }
    }
    if(viHealthQueue.length == getCMV("FPS_WAIT")){
        viHealthQueue.shift();
    }
    if(viFPS > 24){
        viHealthQueue.shift();
        if(viHealthQueue.length == 0){
            viHealthState = 0;
            clearAlert(viHealthState, mlHealthState);
        }
    }else{
        let state = 3;
        if(viFPS > 12){
            state = 1;
        }else if(viFPS > 0){
            state = 2;
        }
        viHealthQueue.push(state);
        if(viHealthQueue.length == getCMV("FPS_WAIT")){
            checkVIHealthQueue(state);
        }
    }
    if(viFPSQueue.length == getCMV("FPS_RATE")){
        let viFPSAvg = viFPSQueue.reduce((a, b) => a + b, 0) / getCMV("FPS_RATE");
        let mlFPSAvg = mlFPSQueue.reduce((a, b) => a + b, 0) / getCMV("FPS_RATE");
        console.log("FPS: ", prettyNumber(viFPSAvg), prettyNumber(mlFPSAvg));
        console.log("DEBUG INFO: ", dynamicVIDura, dynamicMLDura);
        viFPSQueue = [];
        mlFPSQueue = [];
    }
    if(Date.now() - metadata["time"] > 1000 * getCMV("HEALTH_WAIT")){
        setNewMeta();
        postImage();
    }
}
