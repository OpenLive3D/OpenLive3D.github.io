// layout
let layout = document.getElementById("layout");
layout.style.visibility = "hidden";
let system = document.getElementById("system");
system.onclick = function(){
    console.log("click SYSTEM_IMG");
    if(layout.style.visibility == "hidden"){
        layout.style.visibility = "visible";
    }else{
        layout.style.visibility = "hidden";
    }
};
let systemtext = document.getElementById("systemtext");
system.onmouseover = function(){
    systemtext.style.color = "#FFFFFFFF";
}
system.onmouseout = function(){
    systemtext.style.color = "#FFFFFF00";
}

// 3D renderer
let renderer = new THREE.WebGLRenderer({canvas: canvas, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// camera
let camera = new THREE.PerspectiveCamera(30.0, window.innerWidth / window.innerHeight, 0.1, 20.0);
camera.position.set(0.0, 1.4, -1.5);

// camera controls
let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.screenSpacePanning = true;
controls.target.set(0.0, 1.4, 0.0);
controls.update();

function createLayout(cbgc){
    renderer.setClearColor(cbgc, 1);

    // html canvas for drawing debug view
    let dbg = document.createElement("canvas").getContext('2d');
    dbg.canvas.id = "dbg";
    layout.appendChild(dbg.canvas);

    // html canvas for drawing debug view
    layout.appendChild(document.createElement("br"));
    let vrmbtn = document.createElement("input");
    vrmbtn.id = "vrmbtn";
    vrmbtn.setAttribute("type", "file");
    vrmbtn.onchange = function(){
        let txt = "";
        if('files' in vrmbtn && vrmbtn.files.length > 0){
            let files = vrmbtn.files;
            let file = files[0];
            let blob = new Blob([file], {type: "application/octet-stream"});
            let url = URL.createObjectURL(blob);
            loadVRM(url);
        }else{
            console.log("No VRM Loaded");
        }
    }
    layout.appendChild(vrmbtn);

    // text div for debug log
    let logbox = document.createElement('div');
    logbox.id = "logbox";
    layout.appendChild(logbox);

    console.log("gui layout initialized");
}

function drawImage(cm, target, image){

    // get debug camera canvas
    let dbg = document.getElementById(target).getContext('2d');
    dbg.clearRect(0, 0, dbg.canvas.width, dbg.canvas.height);
    dbg.save();
    if (cm['CAMERA_FLIP']){
        dbg.translate(dbg.canvas.width, 0);
        dbg.scale(- cm['CANVAS_RATIO'], cm['CANVAS_RATIO']);
    }else{
        dbg.scale(cm['CANVAS_RATIO'], cm['CANVAS_RATIO']);
    }
    dbg.drawImage(image, 0, 0); // print the camera
    dbg.restore();
}

function drawLandmark(cm, target, landmark){

    // get debug camera canvas
    let dbg = document.getElementById(target).getContext('2d');
    dbg.save();
    if (cm['CAMERA_FLIP']){
        dbg.translate(dbg.canvas.width, 0);
        dbg.scale(- cm['CANVAS_RATIO'], cm['CANVAS_RATIO']);
    }else{
        dbg.scale(cm['CANVAS_RATIO'], cm['CANVAS_RATIO']);
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
        jsonItem.style.color = "white";
        obj.appendChild(jsonItem);

    });
}

function drawScene(scene, cm){
    if (cm['CAMERA_FLIP'] != cm['SCENE_FLIP']){
        cm['SCENE_FLIP'] = !cm['SCENE_FLIP'];
        scene.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));
    }
    renderer.render(scene, camera);
}
