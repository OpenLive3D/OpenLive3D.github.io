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
    let limit = Math.PI / 3;
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
        let reo = keys['righteyeopen'];
        let leo = keys['lefteyeopen'];
        if(getCMV("EYE_SYNC") || Math.abs(reo - leo) < getCMV('EYE_LINK_THRESHOLD')){
            let avgEye = (reo + leo) / 2;
            reo = avgEye;
            leo = avgEye;
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
        let irispos = keys['irispos'];
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

function updateHead(keys){
    if(currentVrm){
        let Ch = currentVrm.humanoid;
        // head
        let neck = Ch.getBoneNode(Tvrmshbn.Neck).rotation;
        neck.set(radLimit(keys['pitch']) * getCMV('NECK_RATIO'),
            radLimit(keys['yaw']) * getCMV('NECK_RATIO'),
            radLimit(keys['roll']) * getCMV('NECK_RATIO'));
        let chest = Ch.getBoneNode(Tvrmshbn.Spine).rotation;
        chest.set(radLimit(keys['pitch']) * getCMV('CHEST_RATIO'),
            radLimit(keys['yaw']) * getCMV('CHEST_RATIO'),
            radLimit(keys['roll']) * getCMV('CHEST_RATIO'));
    }
}

function updateBody(keys){
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

function updateFaceInfo(){
    updateHead(info);
    updateBody(info);
    updateBreath();
    updateMood();
}

// Mood
let mood = Tvrmsbspn.Neutral;
let oldmood = Tvrmsbspn.Neutral;
function getMood(){
    return mood;
}
function setMood(newmood){
    oldmood = mood;
    mood = {
        "angry": Tvrmsbspn.Angry,
        "sorrow": Tvrmsbspn.Sorrow,
        "fun": Tvrmsbspn.Fun,
        "joy": Tvrmsbspn.Joy,
        "neutral": Tvrmsbspn.Neutral,
        "surprised": "Surprised",
        "relaxed": "Relaxed",
        "auto": "AUTO_MOOD_DETECTION"
    }[newmood];
}

// face landmark resolver
function onFaceLandmarkResult(keyPoints, faceInfo){
    if(faceInfo){
        Object.keys(faceInfo).forEach(function(key){
            let sr = getSR(getKeyType(key));
            tmpInfo[key] = (1-sr) * faceInfo[key] + sr * tmpInfo[key];
        });
        updateMouthEyes(tmpInfo);
    }
}

// pose landmark resolver
function onPoseLandmarkResult(keyPoints, poseInfo){
    if(poseInfo){
    }
}

// hand landmark resolver
function onLeftHandLandmarkResult(keyPoints, handInfo){
    if(handInfo){
    }
}
function onRightHandLandmarkResult(keyPoints, handInfo){
    if(handInfo){
    }
}

// arm connection resolver
function onLeftArmResult(keyPoints, armInfo){
}
function onRightArmResult(keyPoints, armInfo){
}

// obtain Holistic Result
let firstTime = true;
let tween = null;
let info = getDefaultFaceInfo();
let tmpInfo = getDefaultFaceInfo();
async function onHolisticResults(results){
    if(firstTime){
        hideLoadbox();
        setInterval(checkFPS, 1000 * FPSCheckDuration);
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
        if(firstTime){
            console.log("1st Face: ", faceInfo);
        }
        onFaceLandmarkResult(keyPoints, faceInfo);
    }
    if(results.poseLandmarks){
        let keyPoints = packPoseHolistic(results.poseLandmarks);
        mergePoints(PoI, keyPoints);
        let poseInfo = pose2Info(keyPoints);
        allInfo["pose"] = poseInfo;
        if(firstTime){
            console.log("1st Pose: ", poseInfo);
        }
        onPoseLandmarkResult(keyPoints, poseInfo);
    }
    if(results.leftHandLandmarks){
        let keyPoints = packHandHolistic(results.leftHandLandmarks, 0);
        mergePoints(PoI, keyPoints);
        let handInfo = hand2Info(keyPoints, 0);
        allInfo["left_hand"] = handInfo;
        if(firstTime){
            console.log("1st Left-Hand: ", handInfo);
        }
        onLeftHandLandmarkResult(keyPoints, handInfo);
    }
    if(results.rightHandLandmarks){
        let keyPoints = packHandHolistic(results.rightHandLandmarks, 1);
        mergePoints(PoI, keyPoints);
        let handInfo = hand2Info(keyPoints, 1);
        allInfo["right_hand"] = handInfo;
        if(firstTime){
            console.log("1st Right-Hand: ", handInfo);
        }
        onRightHandLandmarkResult(keyPoints, handInfo);
    }

    if(results.poseLandmarks){
        if(results.leftHandLandmarks){
            let armInfo = arm2Info(PoI, 0);
            mergePoints(allInfo["left_hand"], armInfo);
            onLeftArmResult(PoI, armInfo);
        }
        if(results.rightHandLandmarks){
            let armInfo = arm2Info(PoI, 1);
            mergePoints(allInfo["right_hand"], armInfo);
            onRightArmResult(PoI, armInfo);
        }
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
    await hModel.send({image: getCameraFrame()});
}

// the main visualization loop
let viLoopCounter = 0;
async function viLoop(){
    viLoopCounter += 1;
    if(currentVrm){
        currentVrm.update(clock.getDelta());
        info = getInfo();
        updateFaceInfo();
        drawScene(scene);
    }
    requestAnimationFrame(viLoop);
}

// mood check
let noMoods = [];
function resetVRMMood(){
    noMoods = [];
}
function checkVRMMood(mood){
    if(mood == "auto"){
        return true;
    }else if(noMoods.includes(mood)){
        return false;
    }else if(currentVrm){
        let tmood = {
            "angry": Tvrmsbspn.Angry,
            "sorrow": Tvrmsbspn.Sorrow,
            "fun": Tvrmsbspn.Fun,
            "joy": Tvrmsbspn.Joy,
            "neutral": Tvrmsbspn.Neutral,
            "surprised": "Surprised",
            "relaxed": "Relaxed",
            "auto": "AUTO_MOOD_DETECTION"
        }[mood];
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
let FPSCheckDuration = 10;
let deltaTime = 100;
function prettyNumber(n){
    return Math.floor(n * 1000) / 1000;
}
function checkFPS(){
    if(mlLoopCounter > FPSCheckDuration){
        deltaTime = Math.floor(Math.min(100, Math.max(50,
            deltaTime * 0.5 + 500 / mlLoopCounter * FPSCheckDuration
        )));
    }
    console.log("FPS: ",
        prettyNumber(viLoopCounter / FPSCheckDuration),
        prettyNumber(mlLoopCounter / FPSCheckDuration),
        " Delta: ", prettyNumber(deltaTime));
    viLoopCounter = 0;
    mlLoopCounter = 0;
}
