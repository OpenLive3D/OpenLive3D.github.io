// 3D renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// camera
const camera = new THREE.PerspectiveCamera(30.0, window.innerWidth / window.innerHeight, 0.1, 20.0);
camera.position.set(0.0, 1.0, 5.0);

// camera controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.screenSpacePanning = true;
controls.target.set(0.0, 1.0, 0.0);
controls.update();

function createLayout(){

    // html canvas for drawing debug view
    let dbg = document.createElement("canvas").getContext('2d');
    dbg.canvas.id = "dbg";
    dbg.canvas.style.position = "absolute";
    dbg.canvas.style.left = "0px";
    dbg.canvas.style.top = "0px";
    dbg.canvas.style.zIndex = 1; // "bring to back"
    document.body.appendChild(dbg.canvas);

    // text div for debug log
    let logbox = document.createElement('div');
    logbox.id = "logbox";
    logbox.style.position = "absolute";
    logbox.style.left = "5px";
    logbox.style.top = "0px";
    logbox.style.zIndex = 2; // "bring to front"
    document.body.appendChild(logbox);

    // vrm renderer
    renderer.domElement.id = "vrmbox";
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.left = "0px";
    renderer.domElement.style.top = "0px";
    document.body.appendChild(renderer.domElement);

    console.log("gui layout initialized");
}

function drawImage(target, image){

    // get debug camera canvas
    let dbg = document.getElementById(target).getContext('2d');
    dbg.clearRect(0, 0, dbg.canvas.width, dbg.canvas.height);
    dbg.save();
    if (CAMERA_FLIP){
        dbg.translate(dbg.canvas.width, 0);
        dbg.scale(- CANVAS_RATIO, CANVAS_RATIO);
    }else{
        dbg.scale(CANVAS_RATIO, CANVAS_RATIO);
    }
    dbg.drawImage(image, 0, 0); // print the camera
    dbg.restore();
}

function drawLandmark(target, landmark){

    // get debug camera canvas
    let dbg = document.getElementById(target).getContext('2d');
    dbg.save();
    if (CAMERA_FLIP){
        dbg.translate(dbg.canvas.width, 0);
        dbg.scale(- CANVAS_RATIO, CANVAS_RATIO);
    }else{
        dbg.scale(CANVAS_RATIO, CANVAS_RATIO);
    }

    Object.keys(landmark).forEach(function (key) {
        for (let i = 0; i < landmark[key].length; i++){
            let p = landmark[key][i];
            dbg.fillStyle = MARKCOLOR[key];
            dbg.beginPath();
            dbg.arc(p[0], p[1], 4, 0, 2 * Math.PI);
            dbg.fill();
        }
    });

    dbg.restore();
}

function printKeys(target, keys){
    let obj = document.getElementById(target);
    obj.innerHTML = '';

    Object.keys(keys).forEach(function (key) {

        let jsonItem = document.createElement('p');
        jsonItem.innerHTML = key + ": " + Math.floor(keys[key] * 1000) / 1000;
        jsonItem.style.color = "red";
        obj.appendChild(jsonItem);

    });
}

function drawScene(scene){
    renderer.render(scene, camera);
}
