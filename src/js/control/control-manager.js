// global scene, light, and clock variable
let scene = new THREE.Scene();
let light = new THREE.DirectionalLight(0xffffff);
light.position.set(1.0, 1.0, 1.0).normalize();
scene.add(light);
let clock = new THREE.Clock();
clock.start();

// config
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
    let limit = Math.PI / 12;
    return Math.max(-limit, Math.min(limit, rad));
}

function ratioLimit(ratio){
    return Math.max(0, Math.min(1, ratio));
}

function updateModel(keys){
    if(currentVrm){
        let Cbsp = currentVrm.blendShapeProxy;
        let Tvrmsbspn = THREE.VRMSchema.BlendShapePresetName;
        let Ch = currentVrm.humanoid;
        let Tvrmshbn = THREE.VRMSchema.HumanoidBoneName;
        // head
        var neck = Ch.getBoneNode(Tvrmshbn.Neck).rotation;
        neck.x = radLimit(keys['pitch']);
        neck.y = radLimit(keys['yaw']);
        neck.z = radLimit(keys['roll']);
        var chest = Ch.getBoneNode(Tvrmshbn.Spine).rotation;
        chest.x = radLimit(keys['pitch'] * getCMV('CHEST_RATIO'));
        chest.y = radLimit(keys['yaw'] * getCMV('CHEST_RATIO'));
        chest.z = radLimit(keys['roll'] * getCMV('CHEST_RATIO'));
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
    }
}

// the main render loop
let info = getDefaultInfo();
function loop(){

    let image = getCameraFrame();

    getFaceInfo(image,
        getCMV('MAX_FACES'),
        getCMV('PREDICT_IRISES'),
        function(keyPoints, faceInfo){
            if(faceInfo){
                drawImage(image);
                drawLandmark(keyPoints);
                let sr = getCMV('STABLIZE_RATIO');
                Object.keys(info).forEach(function(key){
                    info[key] = (1-sr) * faceInfo[key] + sr * info[key];
                });
                printLog(info);
                updateModel(info);
            }
        });

    if(currentVrm){
        currentVrm.update(clock.getDelta());
        drawScene(scene);
    }

    requestAnimationFrame(loop);
}

