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
    createLayout(getCMV('BG_COLOR'));

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

function updateModel(keys){
    if(currentVrm){
        let Cbsp = currentVrm.blendShapeProxy;
        let Tvrmsbspn = THREE.VRMSchema.BlendShapePresetName;
        let Ch = currentVrm.humanoid;
        let Tvrmshbn = THREE.VRMSchema.HumanoidBoneName;
        // head
        var neck = Ch.getBoneNode(Tvrmshbn.Neck).rotation;
        neck.x = radLimit(keys['pitch'] + Math.PI / 2);
        neck.y = radLimit(keys['yaw']);
        neck.z = radLimit(keys['roll']);
        var chest = Ch.getBoneNode(Tvrmshbn.Spine).rotation;
        chest.x = 0;
        chest.y = radLimit(keys['yaw'] * getCMV('CHEST_RATIO'));
        chest.z = radLimit(keys['roll'] * getCMV('CHEST_RATIO'));
        // mouth
        let mouthRatio = Math.max(0, Math.min(1, keys['mouth'] * getCMV('MOUTH_RATIO') + getCMV('MOUTH_OFFSET')));
        Cbsp.setValue(Tvrmsbspn.A, mouthRatio);
        // eyes
        if(Math.abs(keys['righteyeopen'] - keys['lefteyeopen']) < getCMV('EYE_LINK_THRESHOLD')){
            let avgEye = (keys['righteyeopen'] + keys['lefteyeopen']) / 2;
            keys['righteyeopen'] = avgEye;
            keys['lefteyeopen'] = avgEye;
        }
        if(keys['righteyeopen'] < getCMV('RIGHT_EYE_CLOSE_THRESHOLD')){
            Cbsp.setValue(Tvrmsbspn.BlinkR, 1);
        }else if(keys['righteyeopen'] < getCMV('RIGHT_EYE_OPEN_THRESHOLD')){
            let eRatio = (keys['righteyeopen'] - getCMV('RIGHT_EYE_CLOSE_THRESHOLD')) / (getCMV('RIGHT_EYE_OPEN_THRESHOLD') - getCMV('RIGHT_EYE_CLOSE_THRESHOLD'));
            Cbsp.setValue(Tvrmsbspn.BlinkR, (1 - eRatio) * getCMV('RIGHT_EYE_SQUINT_RATIO'));
        }else{
            Cbsp.setValue(Tvrmsbspn.BlinkR, 0);
        }
        if(keys['lefteyeopen'] < getCMV('LEFT_EYE_CLOSE_THRESHOLD')){
            Cbsp.setValue(Tvrmsbspn.BlinkL, 1);
        }else if(keys['lefteyeopen'] < getCMV('LEFT_EYE_OPEN_THRESHOLD')){
            let eRatio = (keys['lefteyeopen'] - getCMV('LEFT_EYE_CLOSE_THRESHOLD')) / (getCMV('LEFT_EYE_OPEN_THRESHOLD') - getCMV('LEFT_EYE_CLOSE_THRESHOLD'));
            Cbsp.setValue(Tvrmsbspn.BlinkL, (1 - eRatio) * getCMV('LEFT_EYE_SQUINT_RATIO'));
        }else{
            Cbsp.setValue(Tvrmsbspn.BlinkL, 0);
        }
    }
}

// the main render loop
function loop(){

    let image = getCameraFrame();
    let info = getDefaultInfo();

    getFaceInfo(image,
        getCMV('MAX_FACES'),
        getCMV('PREDICT_IRISES'),
        function(_info){
            if(_info.length == 2){
                info = _info;
                drawImage(image);
                drawLandmark(info[0]);
                printKeys(info[1]);
                updateModel(info[1]);
            }
        });

    if(currentVrm){
        currentVrm.update(clock.getDelta());
        drawScene(scene);
    }

    requestAnimationFrame(loop);
}

