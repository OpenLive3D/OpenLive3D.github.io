// global scene and light variable
const scene = new THREE.Scene();
const light = new THREE.DirectionalLight(0xffffff);
light.position.set(1.0, 1.0, 1.0).normalize();
scene.add(light);

// global camera and clock
const camera = new THREE.PerspectiveCamera(30.0, window.innerWidth / window.innerHeight, 0.1, 20.0);
camera.position.set(0.0, 1.0, 5.0);
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

// the main render loop
function loop(){

    let image = getCameraFrame();
    let info = [];

    getFaceInfo(image, function(_info){
        info = _info;
        if(info.length == 2){
            drawImage('dbg', image);
            drawLandmark('dbg', info[0]);
            printInfo('logbox', info[1]);
        }
    });

    if(currentVrm){
        currentVrm.update(clock.getDelta());
    }

    drawVRM(scene, camera);

    requestAnimationFrame(loop);
}

