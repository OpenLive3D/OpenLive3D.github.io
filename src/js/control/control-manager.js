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
let cm = getCM();
let currentVrm = undefined;

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
            let head = currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.Head);
            let foot = currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftFoot);
            let pos = {
                "x": head.up.x + head.position.x,
                "y": head.up.y + head.position.y - foot.position.y,
                "z": head.up.z + head.position.z
            };
            resetCameraPos(pos);
            console.log("vrm model loaded");
        });
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

    // load ml libraries
    loadLandmarkModel(function(){
        console.log("landmark model connected");
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
    if(currentVrm){
        let Cbsp = currentVrm.blendShapeProxy;
        let Ch = currentVrm.humanoid;
        // mouth
        let mouthRatio = ratioLimit(keys['mouth'] * getCMV('MOUTH_RATIO'));
        Cbsp.setValue(Tvrmsbspn.A, mouthRatio);
        // eyes
        let reo = keys['righteyeopen'];
        let leo = keys['lefteyeopen'];
        if(Math.abs(reo - leo) < getCMV('EYE_LINK_THRESHOLD')){
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
        let irisY = -(irispos - getCMV('IRIS_POS_OFFSET')) * getCMV('IRIS_POS_RATIO');
        let riris = Ch.getBoneNode(Tvrmshbn.RightEye).rotation;
        let liris = Ch.getBoneNode(Tvrmshbn.LeftEye).rotation;
        riris.y = irisY;
        liris.y = irisY;
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

function updateBreath(){
    if(currentVrm){
        let Ch = currentVrm.humanoid;
        // breath offset
        let bos = getCMV("BREATH_STRENGTH") / 3000 * Math.sin(clock.elapsedTime * Math.PI * getCMV('BREATH_FREQUENCY'));
        // hips
        let hips = Ch.getBoneNode(Tvrmshbn.Hips).position;
        hips.y += bos;
    }
}

function updateMood(){
    if(mood != oldmood){
        let Cbsp = currentVrm.blendShapeProxy;
        Cbsp.setValue(oldmood, 0);
        Cbsp.setValue(mood, 1);
        oldmood = mood;
    }
}

function updateTweenInfo(){
    updateHead(info);
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
        "neutral": Tvrmsbspn.Neutral
    }[newmood];
}

// the main ML loop
let info = getDefaultInfo();
let tmpInfo = getDefaultInfo();
let tween = null;
function mlLoop(){
    let image = getCameraFrame();

    getFaceInfo(image,
        getCMV('MAX_FACES'),
        getCMV('PREDICT_IRISES'),
        function(keyPoints, faceInfo){
            clearDebugCvs();
            if(faceInfo){
                if(getCMV('DEBUG_IMAGE')){
                    drawImage(image);
                }
                if(getCMV('DEBUG_LANDMARK')){
                    drawLandmark(keyPoints);
                }
                Object.keys(tmpInfo).forEach(function(key){
                    let sr = getSR(getKeyType(key));
                    tmpInfo[key] = (1-sr) * faceInfo[key] + sr * tmpInfo[key];
                });
                printLog(tmpInfo);
                updateMouthEyes(tmpInfo);
                if(tween){
                    tween.stop();
                }
                tween = new TWEEN.Tween(info).to(tmpInfo, 100).easing(TWEEN.Easing.Linear.None)
                    .onUpdate(() => updateTweenInfo());
                tween.start();
            }
        });

    requestAnimationFrame(mlLoop);
}

// the main visualization loop
function viLoop(){
    if(currentVrm){
        currentVrm.update(clock.getDelta());
        TWEEN.update();
        drawScene(scene);
    }
    
    requestAnimationFrame(viLoop);
}
