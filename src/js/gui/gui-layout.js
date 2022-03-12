// layout
let sidebar = document.getElementById("thesidebar");
let layout = document.getElementById("layout");
let system = document.getElementById("system");
system.onclick = function(){
    console.log("click SYSTEM_IMG");
    if(sidebar.style.display == "none"){
        sidebar.style.display = "block";
    }else{
        sidebar.style.display = "none";
    }
};
let systemtext = document.getElementById("systemtext");
system.onmouseover = function(){
    systemtext.style.color = "#FFFFFFFF";
};
system.onmouseout = function(){
    if(sidebar.style.display == "none"){
        systemtext.style.color = "#FFFFFF00";
    }
};

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

function createLayout(){
    renderer.setClearColor(getCMV('BG_COLOR'), 1);

    // html canvas for drawing debug view
    let dbg = document.getElementById("dbg");
    dbg.style.width = "100%";

    // vrm loading button
    let vrmbtn = document.getElementById("vrmbtn");
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

    // constant modifier
    let constbox = document.getElementById("constbox");
    let constmodifiers = getConstModifier();
    for(let i = 0; i < constmodifiers.length; i ++){
        let constmodifier = constmodifiers[i];
        let name = document.createElement('p');
        name.style.color = "#fff";
        name.innerHTML = constmodifier[1];
        let item = document.createElement('input');
        item.id = constmodifier[0] + "_box";
        item.style.textAlign = "right";
        item.style.width = "100px";
        item.value = getCMV(constmodifier[0]);
        item.onchange = function(){
            console.log(item.value);
            setCMV(constmodifier[0], item.value);
            if(constmodifier[0] == "BG_COLOR"){
                renderer.setClearColor(item.value, 1);
            }
        };
        constbox.appendChild(name);
        constbox.appendChild(item);
        constbox.appendChild(document.createElement("br"));
    }

    // about the team
    let about = document.getElementById("about");
    about.style.color = "white";
    about.innerHTML = "OpenLive3D - Alpha.0.0.1<br/>";
    about.innerHTML += "Wei Chen - 2022-03-12<br/>";
    let alinks = ["https://github.com/OpenLive3D",
        "https://github.com/Wei-1"];
    for(let i = 0; i < alinks.length; i ++){
        let alink = document.createElement("a");
        alink.href = alinks[i];
        alink.innerHTML = alinks[i];
        alink.setAttribute("target", "_blank");
        alink.setAttribute("rel", "noopener noreferrer");
        about.appendChild(alink);
        about.appendChild(document.createElement("br"));
    }

    console.log("gui layout initialized");
}

function drawImage(image){

    // get debug camera canvas
    let dbg = document.getElementById("dbg").getContext('2d');
    dbg.clearRect(0, 0, dbg.canvas.width, dbg.canvas.height);
    dbg.save();
    if (getCMV('CAMERA_FLIP')){
        dbg.translate(dbg.canvas.width, 0);
        dbg.scale(-getCMV('CANVAS_RATIO'), getCMV('CANVAS_RATIO'));
    }else{
        dbg.scale(getCMV('CANVAS_RATIO'), getCMV('CANVAS_RATIO'));
    }
    dbg.drawImage(image, 0, 0); // print the camera
    dbg.restore();
}

function drawLandmark(landmark){

    // get debug camera canvas
    let dbg = document.getElementById("dbg").getContext('2d');
    dbg.save();
    if (getCMV('CAMERA_FLIP')){
        dbg.translate(dbg.canvas.width, 0);
        dbg.scale(-getCMV('CANVAS_RATIO'), getCMV('CANVAS_RATIO'));
    }else{
        dbg.scale(getCMV('CANVAS_RATIO'), getCMV('CANVAS_RATIO'));
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

function printLog(keys){
    let logbox = document.getElementById('logbox');
    logbox.innerHTML = '';

    Object.keys(keys).forEach(function (key) {

        let jsonItem = document.createElement('p');
        jsonItem.innerHTML = key + ": " + Math.floor(keys[key] * 1000) / 1000;
        jsonItem.style.color = "white";
        logbox.appendChild(jsonItem);

        let value = document.getElementById(key + "_value");
        if(value){
            value.innerHTML = Math.floor(keys[key] * 1000) / 1000;
        }

    });
}

function drawScene(scene){
    if(getCMV('CAMERA_FLIP') != getCMV('SCENE_FLIP')){
        setCMV('SCENE_FLIP', getCMV('CAMERA_FLIP'));
        scene.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));
    }
    renderer.render(scene, camera);
}

function hideObj(target){
    let obj = document.getElementById(target);
    if(obj.className.indexOf("w3-hide") == -1){
        obj.className += " w3-hide";
    }else{
        obj.className = obj.className.replace(" w3-hide", "");
    }
}
