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

// initialize / reinitialize VRM
function loadVRM(vrmurl){
    loadVRMModel(vrmurl,
        function(vrm){
            if(currentVrm){
                scene.remove(currentVrm.scene);
                THREE_VRM.VRMUtils.deepDispose(currentVrm.scene);
            }
            let hips = vrm.humanoid.getNormalizedBoneNode(Tvrmshbn.Hips);
            defaultXYZ = [hips.position.x, hips.position.y, hips.position.z];
            if(vrm.meta.metaVersion === '1'){
                hips.rotation.y = Math.PI;
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
function getMetaVersion(){
    if(currentVrm){
        return currentVrm.meta.metaVersion;
    }
    return null;
}

// initialize the control
function initialize(){
    initConfig();

    // html canvas for drawing debug view
    createLayout();

    // start video
    startCamera(setCameraCallBack);

    // load holistic
    loadMLModels(onWorkerResults, function(){
        console.log("holistic model connected");
    });

    // load vrm model
    loadVRM(getCMV('MODEL'));

    setInterval(checkHealth, 1000 * getCMV("HEALTH_RATE"));
    console.log("controller initialized");
}

function updateVRMMovement(keys){
    if(currentVrm){
        let Cbsp = currentVrm.expressionManager;
        let Ch = currentVrm.humanoid;
        Object.keys(keys['b']).forEach(function(key){
            Cbsp.setValue(key, keys['b'][key]);
        });
        Object.keys(keys['r']).forEach(function(key){
            let crotate = Ch.getNormalizedBoneNode(key).rotation;
            let trotate = keys['r'][key];
            crotate.set(...trotate);
        });
        Object.keys(keys['p']).forEach(function(key){
            let cposition = Ch.getNormalizedBoneNode(key).position;
            let tposition = keys['p'][key];
            cposition.set(...tposition);
        });
        Object.keys(keys['e']).forEach(function(key){
            let ceuler = Ch.getNormalizedBoneNode(key).rotation;
            let teuler = keys['e'][key];
            ceuler.copy(teuler);
        });
        if(!getCMV('HAND_TRACKING')){
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
        if(oldmood != "auto"){
            Cbsp.setValue(moodMap[oldmood], 0);
        }else{
            Cbsp.setValue(Tvrmsbspn.Angry, 0);
            Cbsp.setValue(Tvrmsbspn.Sad, 0);
            Cbsp.setValue(Tvrmsbspn.Happy, 0);
            Cbsp.setValue(Tvrmsbspn.Ee, 0);
        }
        if(mood != "auto"){
            Cbsp.setValue(moodMap[mood], 1);
        }
        oldmood = mood;
    }
}

function updateInfo(){
    let minfo = getVRMMovement();
    updateVRMMovement(minfo);
    updatePosition(minfo);
    updateBreath();
    updateMood();
}

function exportRotate(){
    let vrmRotate = {};
    if(currentVrm){
        for(let area of Object.values(Tvrmshbn)){
            let areaNode = currentVrm.humanoid.getNormalizedBoneNode(area);
            if(areaNode){
                let hasNonZeros = false;
                let areaRotate = [];
                for(let j of 'xyz'){
                    areaRotate.push(areaNode.rotation[j]);
                    if(areaNode.rotation[j] != 0){
                        hasNonZeros = true;
                    }
                }
                if(hasNonZeros){
                    vrmRotate[area] = areaRotate;
                }
            }
        }
    }else{
        console.log("VRM not loaded");
    }
    return vrmRotate;
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
let mood = 'auto';
let oldmood = 'auto';
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
function setMood(newmood){
    mood = newmood;
    setCMV("MOOD", newmood);
}

function exportExpression(){
    let vrmExpression = {};
    if(currentVrm){
        let Cbsp = currentVrm.expressionManager;
        for(let expression of Object.values(Tvrmsbspn)){
            if(Cbsp.getValue(expression) && Cbsp.getValue(expression) != 0){
                vrmExpression[expression] = Cbsp.getValue(expression);
            }
        }
    }else{
        console.log("VRM not loaded");
    }
    return vrmExpression;
}

async function postImage(){
    getMLModel(getCMV("HAND_TRACKING")).postMessage({
        "metakey": getMetaKey(),
        "image": getCaptureImage()
    });
}

function updateDebugVideo(){
    if(true){
        clearDebugCvs();
        if(getCMV('DEBUG_IMAGE')){
            drawImage(getCameraFrame());
        }
        if(getCMV('DEBUG_LANDMARK')){
            drawLandmark(getPoI());
        }
    }
}

// the main visualization loop
async function viLoop(){
    if(currentVrm && checkImage()){
        addCMV("VI_LOOP_COUNTER", 1);

        updateDebugVideo();

        currentVrm.update(clock.getDelta());
        updateInfo();
        drawScene(scene);
        printLog(getLog());
        setTimeout(function(){
            requestAnimationFrame(viLoop);
        }, getCMV("DYNA_VI_DURATION"));
    }else{
        setTimeout(function(){
            requestAnimationFrame(viLoop);
        }, getCMV("MAX_VI_DURATION"));
    }
    if(getCMV("GOOD_TO_GO")){
        if(getCMV("LOADING_SCENE")){
            correctMeta();
            hideLoadbox();
            console.log("ml & visual loops validated");
        }
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
function checkVRMMood(tmoodk){
    if(tmoodk == "auto"){
        return true;
    }else if(noMoods.includes(tmoodk)){
        return false;
    }else if(currentVrm){
        let tmoodv = moodMap[tmoodk];
        if(currentVrm.expressionManager.getExpressionTrackName(tmoodv)){
            return true;
        }else if(currentVrm.expressionManager.getExpressionTrackName(tmoodk)){
            return true;
        }else{
            noMoods.push(tmoodk);
            return false;
        }
    }else{
        return false;
    }
}

// integration check
async function checkIntegrate(){
    drawLoading();
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
        drawLoading();
        if(checkVRMModel() && checkMLModel() && checkImage()){
            console.log("start integration validation");
            checkIntegrate();
        }else{
            requestAnimationFrame(initLoop);
        }
    }
}

// validate counter
let viFPSQueue = [];
let mlFPSQueue = [];
let viHealthQueue = [];
let mlHealthQueue = [];
let viHealthState = 0;
let mlHealthState = 0;
function prettyNumber(n){
    return Math.floor(n * 1000) / 1000;
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
    let viFPS = getCMV("VI_LOOP_COUNTER") / getCMV("HEALTH_RATE");
    let mlFPS = getCMV("ML_LOOP_COUNTER") / getCMV("HEALTH_RATE");
    let dynamicMLDura = getCMV("DYNA_ML_DURATION");
    if(isNaN(dynamicMLDura)){
        setCMV("DYNA_ML_DURATION", getCMV("MIN_ML_DURATION"));
    }
    dynamicMLDura *= (mlFPS / getCMV("ML_FPS_LIMIT"));
    dynamicMLDura = Math.max(dynamicMLDura, getCMV("MIN_ML_DURATION"));
    dynamicMLDura = Math.min(dynamicMLDura, getCMV("MAX_ML_DURATION"));
    setCMV("DYNA_ML_DURATION", dynamicMLDura);
    let dynamicVIDura = getCMV("DYNA_VI_DURATION");
    if(isNaN(dynamicVIDura)){
        dynamicVIDura = getCMV("MIN_VI_DURATION");
    }
    dynamicVIDura *= (viFPS / getCMV("3D_FPS_LIMIT"));
    dynamicVIDura = Math.max(dynamicVIDura, getCMV("MIN_VI_DURATION"));
    dynamicVIDura = Math.min(dynamicVIDura, getCMV("MAX_VI_DURATION"));
    setCMV("DYNA_VI_DURATION", dynamicVIDura);
    setCMV("VI_LOOP_COUNTER", 0);
    setCMV("ML_LOOP_COUNTER", 0);
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
    if(Date.now() - getMetaTime() > 1000 * getCMV("HEALTH_WAIT")){
        setNewMeta();
        postImage();
    }
    let allLog = {"general": {"3D-FPS": 0, "ML-FPS": 0}};
    if(viFPSQueue.length > 0){
        allLog["general"]["3D-FPS"] = viFPSQueue[viFPSQueue.length - 1];
    }
    if(mlFPSQueue.length > 0){
        allLog["general"]["ML-FPS"] = mlFPSQueue[mlFPSQueue.length - 1];
    }
    postLog(allLog);
}
