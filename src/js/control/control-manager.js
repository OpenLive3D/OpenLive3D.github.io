// global scene, light, and clock variable
const scene = new THREE.Scene();
const light = new THREE.DirectionalLight(0xffffff);
light.position.set(1.0, 1.0, 1.0).normalize();
scene.add(light);
const clock = new THREE.Clock();
clock.start();

let currentVrm = undefined;

// initialize the control
function initialize(){

    // html canvas for drawing debug view
    createLayout();

    // start video
    startCamera(function(){
        linkCamera2Context(document.getElementById('dbg'));
        console.log("video connected");
    });

    // load ml libraries
    loadLandmarkModel(function(){
        console.log("landmark model connected");
    });

    // load vrm model
    loadVRMModel(DEFAULT_VRM_URL, function(vrm){
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
    chest.y = keys['yaw'] / 3;
    chest.z = keys['roll'] / 3;
    // mouth
    Cbsp.setValue(Tvrmsbspn.A, keys['mouth'] * 1.6);
    // eyes
    if(keys['righteyeopen'] < 0.26) Cbsp.setValue(Tvrmsbspn.BlinkR, 1);
    else Cbsp.setValue(Tvrmsbspn.BlinkR, 0);
    if(keys['lefteyeopen'] < 0.26) Cbsp.setValue(Tvrmsbspn.BlinkL, 1);
    else Cbsp.setValue(Tvrmsbspn.BlinkL, 0);
}

// the main render loop
function loop(){

    let image = getCameraFrame();
    let info = getDefaultInfo();

    getFaceInfo(image, function(_info){
        if(_info.length == 2){
            info = _info;
            drawImage('dbg', image);
            drawLandmark('dbg', info[0]);
            printKeys('logbox', info[1]);
            updateModel(info[1]);
        }
    });

    if(currentVrm){
        currentVrm.update(clock.getDelta());
        drawScene(scene);
    }

    requestAnimationFrame(loop);
}

