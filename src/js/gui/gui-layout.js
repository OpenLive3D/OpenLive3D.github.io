// layout
let sidebar = document.getElementById("thesidebar");
let moodbar = document.getElementById("themoodbar");
let layout = document.getElementById("layout");
let system = document.getElementById("system");
system.onclick = function(){
    console.log("click SYSTEM_IMG");
    if(sidebar.style.display == "none"){
        sidebar.style.display = "block";
        moodbar.style.display = "none";
    }else{
        sidebar.style.display = "none";
        moodbar.style.display = "block";
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
camera.position.set(0.0, 1.4, -1.4);

// camera controls
let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.screenSpacePanning = true;
controls.target.set(0.0, 1.4, 0.0);
controls.update();

function resetCameraPos(pos){
    camera.position.set(pos.x, pos.y, pos.z - 1.4);
    controls.target.set(pos.x, pos.y, pos.z);
}

function createLayout(){
    renderer.setClearColor(getCMV('BG_COLOR'), 1);

    // html canvas for drawing debug view
    let dbg = document.getElementById("dbg");
    dbg.style.width = "100%";
    let dbgimcheck = document.getElementById("dbgimcheck");
    if(getCMV("DEBUG_IMAGE")){
        dbgimcheck.setAttribute('checked', "checked");
    }
    dbgimcheck.onclick = function myFunction(){
        setCMV("DEBUG_IMAGE", dbgimcheck.checked);
    }
    let dbglmcheck = document.getElementById("dbglmcheck");
    if(getCMV("DEBUG_LANDMARK")){
        dbglmcheck.setAttribute('checked', "checked");
    }
    dbglmcheck.onclick = function myFunction(){
        setCMV("DEBUG_LANDMARK", dbglmcheck.checked);
    }

    // vrm loading button
    let vrmbtn = document.getElementById("vrmbtn");
    vrmbtn.onchange = function(){
        let txt = "";
        if('files' in vrmbtn && vrmbtn.files.length > 0){
            let files = vrmbtn.files;
            let file = files[0];
            let blob = new Blob([file], {type: "application/octet-stream"});
            let url = URL.createObjectURL(blob);
            setCMV("MODEL", url);
            loadVRM(url);
        }else{
            console.log("No VRM Loaded");
        }
    }

    // config modifier
    let confbox = document.getElementById("confbox");
    let confmodifiers = getConfigModifiers();
    Object.keys(confmodifiers).forEach(function(key){
        confmodifier = confmodifiers[key];
        let confkey = document.createElement('div');
        confkey.className = "confkey";
        confkey.id = "confkey_" + key;
        confkey.innerHTML = "ᐅ " + key;
        confkey.onclick = function(){
            Object.keys(confmodifiers).forEach(function(otherkey){
                let tmpkey = document.getElementById("confkey_" + otherkey);
                let tmpgroup = document.getElementById("confgroup_" + otherkey);
                if(otherkey == key && tmpgroup.className == "w3-margin w3-hide"){
                    tmpkey.innerHTML = "ᐁ " + otherkey;
                    tmpgroup.className = "w3-margin";
                }else{
                    tmpkey.innerHTML = "ᐅ " + otherkey;
                    tmpgroup.className = "w3-margin w3-hide";
                }
            });
        }
        confbox.appendChild(confkey);
        let confgroup = document.createElement('div');
        confgroup.className = "w3-margin w3-hide";
        confgroup.id = "confgroup_" + key;
        confbox.appendChild(confgroup);
        for(let i = 0; i < confmodifier.length; i ++){
            let configitem = confmodifier[i];
            let name = document.createElement('text');
            name.style.color = "#fff";
            name.innerHTML = configitem['title'];
            let item = document.createElement('input');
            item.id = configitem['key'] + "_box";
            item.style.textAlign = "right";
            item.style.width = "100px";
            item.value = getCMV(configitem['key']);
            item.onchange = function(){
                console.log(configitem['key'], item.value);
                if('range' in configitem){
                    if(item.value < configitem['range'][0]){
                        item.value = configitem['range'][0];
                    }else if(item.value < configitem['range'][1]){
                    }else{
                        item.value = configitem['range'][1];
                    }
                }else if('valid' in configitem){
                    if(configitem['key'] in getBinaryCM()){
                        item.value = item.value != "false";
                    }else if(!configitem['valid'].includes(item.value)){
                        item.value = configitem['valid'][0];
                    }
                }
                setCMV(configitem['key'], item.value);
                if(configitem['key'] == "BG_COLOR"){
                    renderer.setClearColor(item.value, 1);
                }
            };
            let info = document.createElement('text');
            info.className = "w3-tooltip";
            info.style.color = "#fff9";
            info.innerHTML = " [<i>info</i>] ";
            let span = document.createElement('span');
            span.setAttribute('style', "position:absolute;width:200px;left:-100px");
            span.className = "w3-text w3-tag";
            span.innerHTML = configitem['describe'];
            info.appendChild(span);
            confgroup.appendChild(name);
            confgroup.appendChild(info);
            confgroup.appendChild(document.createElement("br"));
            confgroup.appendChild(item);
            confgroup.appendChild(document.createElement("br"));
        }
    });

    // mood
    let moods = ['angry', 'sorrow', 'fun', 'joy', 'neutral'];
    for(let i = 0; i < moods.length; i ++){
        let mood = moods[i];
        if(getCMV("MOOD_" + mood.toUpperCase())){
            let moodobj = document.createElement('img');
            moodobj.src = "asset/mood/" + mood + ".png";
            moodobj.style.width = "30px";
            moodobj.style.cursor = "pointer";
            moodobj.style.marginLeft = "12px";
            moodobj.onclick = function(){
                setMood(mood);
            }
            moodbar.appendChild(moodobj);
            moodbar.appendChild(document.createElement("br"));
            moodbar.appendChild(document.createElement("br"));
        }
    }

    // about the team
    let about = document.getElementById("about");
    about.style.color = "white";
    let alinks = [
        ["https://github.com/OpenLive3D", "OpenLive3D - " + getCMV("VERSION")],
        ["https://github.com/OpenLive3D/OpenLive3D.github.io", "Dev Date - " + getCMV("DEV_DATE")]
    ];
    for(let i = 0; i < alinks.length; i ++){
        let alink = document.createElement("a");
        alink.href = alinks[i][0];
        alink.innerHTML = alinks[i][1];
        alink.setAttribute("target", "_blank");
        alink.setAttribute("rel", "noopener noreferrer");
        about.appendChild(alink);
        about.appendChild(document.createElement("br"));
    }

    console.log("gui layout initialized");
}

function clearDebugCvs(){
    if(isVisible("dbgbox")){
        // get debug camera canvas
        let dbg = document.getElementById("dbg").getContext('2d');
        dbg.clearRect(0, 0, dbg.canvas.width, dbg.canvas.height);
        dbg.fillStyle = 'rgba(0,0,0,0.8)';
        dbg.fillRect(0, 0, dbg.canvas.width, dbg.canvas.height);
    }
}

function drawImage(image){
    if(isVisible("dbgbox")){
        // get debug camera canvas
        let dbg = document.getElementById("dbg").getContext('2d');
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
}

function drawLandmark(landmark){
    if(isVisible("dbgbox")){
        // get debug camera canvas
        let dbg = document.getElementById("dbg").getContext('2d');
        dbg.save();
        if (getCMV('CAMERA_FLIP')){
            dbg.translate(dbg.canvas.width, 0);
            dbg.scale(-getCMV('CANVAS_RATIO'), getCMV('CANVAS_RATIO'));
        }else{
            dbg.scale(getCMV('CANVAS_RATIO'), getCMV('CANVAS_RATIO'));
        }
        Object.keys(landmark).forEach(function(key){
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
}

function printLog(keys){
    if(isVisible("logbox")){
        let logbox = document.getElementById('logbox');
        logbox.innerHTML = '';
        Object.keys(keys).forEach(function(key){
            let jsonItem = document.createElement('text');
            jsonItem.innerHTML = key + ": " + Math.floor(keys[key] * 1000) / 1000 + "<br/>";
            jsonItem.style.color = "white";
            logbox.appendChild(jsonItem);
            let value = document.getElementById(key + "_value");
            if(value){
                value.innerHTML = Math.floor(keys[key] * 1000) / 1000;
            }
        });
    }
}

function drawScene(scene){
    if(getCMV('CAMERA_FLIP') != getCMV('SCENE_FLIP')){
        setCMV('SCENE_FLIP', getCMV('CAMERA_FLIP'));
        scene.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));
    }
    renderer.render(scene, camera);
}

function isVisible(target){
    let obj = document.getElementById(target);
    return obj.className.indexOf("w3-hide") == -1 &&
        sidebar.style.display != "none";
}

function hideObj(target){
    let obj = document.getElementById(target);
    if(obj.className.indexOf("w3-hide") == -1){
        obj.className += " w3-hide";
    }else{
        obj.className = obj.className.replace(" w3-hide", "");
    }
}
