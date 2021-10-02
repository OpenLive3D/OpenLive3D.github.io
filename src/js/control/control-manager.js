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

// initialize the control
function initialize(){

    // html canvas for drawing debug view
    createLayout(cm['BG_COLOR']);

    // start video
    startCamera(function(){
        linkCamera2Context(
            document.getElementById('dbg'),
            cm['CANVAS_RATIO']);
        console.log("video connected");
    });

    // load ml libraries
    loadLandmarkModel(function(){
        console.log("landmark model connected");
    });

    // load vrm model
    loadVRMModel(cm['MODEL'],
        function(vrm){
            if(currentVrm){
                scene.remove(currentVrm.scene);
                currentVrm.dispose();
            }
            currentVrm = vrm;
            scene.add(vrm.scene);
            console.log("vrm model loaded");
        });

    console.log("controller initialized");
}

function updateModel(keys){
    if(currentVrm){
        let Cbsp = currentVrm.blendShapeProxy;
        let Tvrmsbspn = THREE.VRMSchema.BlendShapePresetName;
        let Ch = currentVrm.humanoid;
        let Tvrmshbn = THREE.VRMSchema.HumanoidBoneName;
        // head
        var neck = Ch.getBoneNode(Tvrmshbn.Neck).rotation;
        neck.x = keys['pitch'] + Math.PI / 2;
        neck.y = keys['yaw'];
        neck.z = keys['roll'];
        var chest = Ch.getBoneNode(Tvrmshbn.Spine).rotation;
        chest.x = 0;
        chest.y = keys['yaw'] * cm['CHEST_RATIO'];
        chest.z = keys['roll'] * cm['CHEST_RATIO'];
        // mouth
        Cbsp.setValue(Tvrmsbspn.A,
            Math.min(1, keys['mouth'] * cm['MOUTH_RATIO']));
        // eyes
        if(keys['righteyeopen'] < cm['RIGHT_EYE_THRESHOLD']){
            Cbsp.setValue(Tvrmsbspn.BlinkR, 1);
        }else Cbsp.setValue(Tvrmsbspn.BlinkR, 0);
        if(keys['lefteyeopen'] < cm['LEFT_EYE_THRESHOLD']){
            Cbsp.setValue(Tvrmsbspn.BlinkL, 1);
        }else Cbsp.setValue(Tvrmsbspn.BlinkL, 0);
    }
}

// the main render loop
function loop(){

    let image = getCameraFrame();
    let info = getDefaultInfo();

    getFaceInfo(image,
        cm['MAX_FACES'],
        cm['PREDICT_IRISES'],
        function(_info){
            if(_info.length == 2){
                info = _info;
                drawImage(cm, 'dbg', image);
                drawLandmark(cm, 'dbg', info[0]);
                printKeys('logbox', info[1]);
                updateModel(info[1]);
            }
        });

    if(currentVrm){
        currentVrm.update(clock.getDelta());
        drawScene(scene, cm);
    }

    requestAnimationFrame(loop);
}

