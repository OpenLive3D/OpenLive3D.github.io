// layout
let sidebar = document.getElementById("thesidebar");
let moodbar = document.getElementById("themoodbar");
let systembox = document.getElementById("systembox");
systembox.onclick = function(){
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
systembox.onmouseover = function(){
    systemtext.style.color = "#FFFFFFFF";
};
systembox.onmouseout = function(){
    if(sidebar.style.display == "none"){
        systemtext.style.color = "#FFFFFF00";
    }
};

// 3D renderer
let renderer = new THREE.WebGLRenderer({canvas: canvas, alpha: true});
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// 3D scene
let scene = new THREE.Scene();
function addToScene(obj){
    scene.add(obj);
}
function removeFromScene(obj){
    scene.remove(obj);
}

// light
let light = new THREE.DirectionalLight(0xffffff);
light.position.set(0.0, 1.0, -1.0).normalize();
scene.add(light);
function getDirectionalLight(){
    return light;
}

// camera
let camera = new THREE.PerspectiveCamera(30.0, window.innerWidth / window.innerHeight, 0.1, 20.0);
camera.position.set(0.0, 1.4, -1.4);

// camera controls
let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.screenSpacePanning = true;
controls.target.set(0.0, 1.4, 0.0);
controls.update();

window.addEventListener('resize', onWindowResize, false);
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function resetCameraPos(pos){
    camera.position.set(pos.x, pos.y, pos.z - 1.4);
    controls.target.set(pos.x, pos.y, pos.z);
}

function setBackGround(){
    if(getCMV('BG_UPLOAD')){
        renderer.setClearColor('#000', 0);
        document.getElementById('bgimg').style.backgroundImage = getCMV('BG_UPLOAD');
    }else{
        renderer.setClearColor(getCMV('BG_COLOR'), 1);
    }
}

function setCameraCallBack(){
    let dbg = document.getElementById("dbg");
    let instantFrame = getCameraFrame();
    dbg.width = Math.floor(
        instantFrame.videoWidth * getCMV('CANVAS_RATIO'));
    dbg.height = Math.floor(
        instantFrame.videoHeight * getCMV('CANVAS_RATIO'));

    let videoselect = document.getElementById("videoselect");
    videoselect.value = getCMV("CURRENT_CAMERA_ID");
}

function createLayout(){
    setBackGround();

    // vrm loading button
    let vrmboxbtn = document.getElementById("vrmboxbutton");
    vrmboxbtn.innerHTML = getL("Model Manager");
    let vrmbox = document.getElementById("vrmbox");
    vrmbox.innerHTML = "";
    let vrmbtn = document.createElement('input');
    vrmbtn.setAttribute("type", "file");
    vrmbtn.setAttribute("accept", ".vrm");
    vrmbtn.style.display = "none";
    vrmbtn.onchange = function(){
        let txt = "";
        if('files' in vrmbtn && vrmbtn.files.length > 0){
            let files = vrmbtn.files;
            let file = files[0];
            let blob = new Blob([file], {type: "application/octet-stream"});
            let url = URL.createObjectURL(blob);
            loadVRM(url);
            setCMV("CUSTOM_MODEL", true);
        }else{
            console.log("No VRM Loaded");
        }
    }
    vrmbox.appendChild(vrmbtn);
    let vrmbtnkey = document.createElement('div');
    vrmbtnkey.className = "confkey";
    vrmbtnkey.id = "vrmbtnkey";
    vrmbtnkey.innerHTML = "ᐅ " + getL("Upload VRM Model");
    vrmbtnkey.onclick = function(){
        vrmbtn.click();
    }
    vrmbox.appendChild(vrmbtnkey);
    let vrmurlkey = document.createElement('div');
    vrmurlkey.className = "confkey";
    vrmurlkey.id = "vrmurlkey";
    vrmurlkey.innerHTML = "ᐅ " + getL("Set VRM URL");
    vrmbox.appendChild(vrmurlkey);
    let vrmurlbox = document.createElement('div');
    vrmurlbox.className = "w3-hide";
    vrmurlbox.id = "vrmurlbox";
    vrmurlbox.style.color = "white";
    vrmurlkey.onclick = function(){
        if(vrmurlbox.className == "w3-hide"){
            vrmurlkey.innerHTML = "ᐁ " + getL("Set VRM URL");
            vrmurlbox.className = "";
        }else{
            vrmurlkey.innerHTML = "ᐅ " + getL("Set VRM URL");
            vrmurlbox.className = "w3-hide";
        }
    }
    vrmbox.appendChild(vrmurlbox);
    let vrmurlinput = document.createElement("input");
    vrmurlinput.style.width = "190px";
    vrmurlinput.value = "";
    vrmurlbox.appendChild(vrmurlinput);
    let vrmurlsubmit = document.createElement("input");
    vrmurlsubmit.setAttribute("type", "button");
    vrmurlsubmit.setAttribute("value", getL("Set URL"));
    vrmurlsubmit.onclick = function(){
        loadVRM(vrmurlinput.value);
        setCMV("MODEL", vrmurlinput.value);
        setCMV("CUSTOM_MODEL", true);
    }
    vrmurlbox.appendChild(vrmurlsubmit);

    // html canvas for drawing debug view
    let videoctlbtn = document.getElementById("videoctlbutton");
    videoctlbtn.innerHTML = getL("Video Control");
    let videoselect = document.getElementById("videoselect");
    videoselect.onchange = function(){
        console.log("set camera: ", videoselect.value);
        setVideoStream(videoselect.value);
    }
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

    // text alignment
    let effectboxbutton = document.getElementById("effectboxbutton");
    effectboxbutton.innerHTML = getL("Visual Effect");
    let confboxbtn = document.getElementById("confboxbutton");
    confboxbtn.innerHTML = getL("Setting");
    let dbgimlabel = document.getElementById("dbgimlabel");
    dbgimlabel.innerHTML = getL("Image");
    let dbglmlabel = document.getElementById("dbglmlabel");
    dbglmlabel.innerHTML = getL("Landmark");

    // effect modifier
    let effectbox = document.getElementById("effectbox");
    effectbox.innerHTML = "";
    let alleffects = getAllEffects();
    Object.keys(alleffects).forEach(function(key){
        let effectkey = document.createElement('div');
        effectkey.className = "effectkey";
        effectkey.id = "effectkey_" + key;
        effectkey.innerHTML = "ᐅ " + getL(key);
        effectkey.onclick = function(){
            Object.keys(alleffects).forEach(function(otherkey){
                let tmpkey = document.getElementById("effectkey_" + otherkey);
                let tmpgroup = document.getElementById("effectgroup_" + otherkey);
                if(otherkey == key && tmpgroup.className == "w3-margin w3-hide"){
                    tmpkey.innerHTML = "ᐁ " + getL(otherkey);
                    tmpgroup.className = "w3-margin";
                }else{
                    tmpkey.innerHTML = "ᐅ " + getL(otherkey);
                    tmpgroup.className = "w3-margin w3-hide";
                }
            });
        }
        effectbox.appendChild(effectkey);
        let effectgroup = document.createElement('div');
        effectgroup.className = "w3-margin w3-hide";
        effectgroup.id = "effectgroup_" + key;
        effectbox.appendChild(effectgroup);
        let effectlist = alleffects[key];
        for(let effectitem of effectlist){
            let info = document.createElement('text');
            info.className = "w3-tooltip";
            info.style.color = "#fff9";
            info.innerHTML = " [ℹ] ";
            effectgroup.appendChild(info);
            let span = document.createElement('span');
            span.className = "w3-text w3-tag";
            span.innerHTML = getL(effectitem['describe']);
            info.appendChild(span);
            let itemtext = document.createElement('text');
            itemtext.className = "w3-tooltip";
            itemtext.style.color = "#fff";
            itemtext.innerHTML = " " + effectitem['key'] + " ";
            effectgroup.appendChild(itemtext);
            let itemcheck = document.createElement('input');
            itemcheck.id = effectitem['key'] + "_box";
            itemcheck.setAttribute("type", "checkbox");
            itemcheck.checked = false;
            itemcheck.onclick = function(){
                if(itemcheck.checked){
                    effectitem['enableEffect']();
                }else{
                    effectitem['disableEffect']();
                }
            }
            effectgroup.appendChild(itemcheck);
            let itemdiv = document.createElement('div');
            effectgroup.appendChild(itemdiv);
        }
    });

    // config modifier
    let confbox = document.getElementById("confbox");
    confbox.innerHTML = "";
    let confmodifiers = getConfigModifiers();
    Object.keys(confmodifiers).forEach(function(key){
        confmodifier = confmodifiers[key];
        let confkey = document.createElement('div');
        confkey.className = "confkey";
        confkey.id = "confkey_" + key;
        confkey.innerHTML = "ᐅ " + getL(key);
        confkey.onclick = function(){
            Object.keys(confmodifiers).forEach(function(otherkey){
                let tmpkey = document.getElementById("confkey_" + otherkey);
                let tmpgroup = document.getElementById("confgroup_" + otherkey);
                if(otherkey == key && tmpgroup.className == "w3-margin w3-hide"){
                    tmpkey.innerHTML = "ᐁ " + getL(otherkey);
                    tmpgroup.className = "w3-margin";
                }else{
                    tmpkey.innerHTML = "ᐅ " + getL(otherkey);
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
            let info = document.createElement('text');
            info.className = "w3-tooltip";
            info.style.color = "#fff9";
            info.innerHTML = " [ℹ] ";
            confgroup.appendChild(info);
            let span = document.createElement('span');
            span.className = "w3-text w3-tag";
            span.innerHTML = getL(configitem['describe']);
            info.appendChild(span);
            let name = document.createElement('text');
            name.className = "w3-tooltip";
            name.style.color = "#fff";
            name.innerHTML = getL(configitem['title']);
            confgroup.appendChild(name);
            confgroup.appendChild(document.createElement("br"));
            let item = document.createElement('input');
            item.id = configitem['key'] + "_box";
            confgroup.appendChild(item);
            if(getBinaryCM().includes(configitem['key'])){
                item.setAttribute("type", "checkbox");
                item.checked = getCMV(configitem['key']);
                item.onclick = function myFunction(){
                    setCMV(configitem['key'], item.checked);
                    if(key == 'UI'){
                        createMoodLayout();
                    }
                };
            }else if(configitem['key'] == "BG_UPLOAD"){
                item.setAttribute("type", "file");
                item.setAttribute("accept", "image/*");
                item.onchange = function myFunction(){
                    let file = item.files[0];
                    if(file){
                        let reader = new FileReader();
                        reader.onloadend = function(){
                            setCMV(configitem['key'], "url(" + reader.result + ")");
                            setBackGround();
                        }
                        reader.readAsDataURL(file);
                    }else{
                        setCMV("BG_UPLOAD", "");
                        setBackGround();
                    }
                };
                let cancelitem = document.createElement("input");
                cancelitem.setAttribute("type", "button");
                cancelitem.setAttribute("value", "Remove Image");
                cancelitem.onclick = function(){
                    item.value = "";
                    setCMV("BG_UPLOAD", "");
                    setBackGround();
                }
                confgroup.appendChild(cancelitem);
            }else if(configitem['key'] == "BG_COLOR"){
                item.setAttribute("type", "color");
                item.setAttribute("value", getCMV("BG_COLOR"));
                item.onchange = function myFunction(){
                    setCMV("BG_UPLOAD", "");
                    setCMV("BG_COLOR", item.value);
                    setBackGround();
                };
            }else if(getSelectCM().includes(configitem['key'])){
                item.style.display = "none";
                let itemselect = document.createElement("select");
                for(let selectitemname of configitem['valid']){
                    let selectitem = document.createElement("option");
                    selectitem.value = selectitemname;
                    selectitem.innerHTML = selectitemname;
                    itemselect.appendChild(selectitem);
                    if(selectitemname == getCMV(configitem['key'])){
                        itemselect.value = selectitemname;
                    }
                }
                itemselect.onchange = function myFunction(){
                    setCMV(configitem['key'], itemselect.value);
                    if(configitem['key'] == "LANGUAGE"){
                        createLayout();
                    }else if(configitem['key'] == "TRACKING_MODE"){
                        setTrackingModeSelect(itemselect.value);
                    }
                };
                confgroup.appendChild(itemselect);
            }else{
                item.setAttribute("type", "range");
                item.setAttribute("min", 0);
                item.setAttribute("max", 1000);
                let setrange = configitem['range'][1] - configitem['range'][0];
                let setvalue = (getCMV(configitem['key']) - configitem['range'][0]) * 1000 / setrange;
                item.setAttribute("value", setvalue);
                item.onchange = function(){
                    let newvalue = item.value / 1000 * setrange + configitem['range'][0];
                    itemval.value = newvalue;
                    itemval.onchange();
                }
                let itemval = document.createElement("input");
                itemval.style.textAlign = "right";
                itemval.style.width = "100px";
                itemval.value = getCMV(configitem['key']);
                itemval.onchange = function(){
                    console.log(configitem['key'], itemval.value);
                    if(itemval.value < configitem['range'][0]){
                        itemval.value = configitem['range'][0];
                    }else if(itemval.value < configitem['range'][1]){
                    }else{
                        itemval.value = configitem['range'][1];
                    }
                    let newvalue = (itemval.value - configitem['range'][0]) * 1000 / setrange;
                    item.setAttribute("value", newvalue);
                    setCMV(configitem['key'], itemval.value);
                };
                confgroup.appendChild(itemval);
            }
            confgroup.appendChild(document.createElement("br"));
        }
    });

    // log modifier
    let logboxbtn = document.getElementById("logboxbutton");
    logboxbtn.innerHTML = getL("Parameters");
    let logbox = document.getElementById("logbox");
    logbox.innerHTML = "";
    let logitems = getLogItems();
    for(let key of logitems){
        let logkey = document.createElement('div');
        logkey.className = "confkey";
        logkey.id = "logkey_" + key;
        logkey.innerHTML = "ᐅ " + getL(key);
        let loggroup = document.createElement('div');
        loggroup.className = "w3-margin w3-hide";
        loggroup.id = "logbox_" + key;
        loggroup.style.color = "white";
        logkey.onclick = function(){
            if(loggroup.className == "w3-margin w3-hide"){
                logkey.innerHTML = "ᐁ " + getL(key);
                loggroup.className = "w3-margin";
            }else{
                logkey.innerHTML = "ᐅ " + getL(key);
                loggroup.className = "w3-margin w3-hide";
            }
        }
        logbox.appendChild(logkey);
        logbox.appendChild(loggroup);
    }
    let extralogkey = document.createElement('div');
    extralogkey.className = "confkey";
    extralogkey.id = "logkey_extra";
    extralogkey.innerHTML = "ᐅ extra";
    let extraloggroup = document.createElement('div');
    extraloggroup.className = "w3-margin w3-hide";
    let exportVRMRotateButton = document.createElement("input");
    exportVRMRotateButton.setAttribute("type", "button");
    exportVRMRotateButton.setAttribute("value", getL("Export Pose & Expression"));
    exportVRMRotateButton.onclick = function(){
        let exportJSON = {
            "metaVersion": getMetaVersion(),
            "rotate": exportRotate(),
            "expression": exportExpression()
        };
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportJSON));
        let dlAnchorElem = document.createElement("a");
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "vrm_pose_expression.json");
        dlAnchorElem.click();
        dlAnchorElem.remove();
    }
    extralogkey.onclick = function(){
        if(extraloggroup.className == "w3-margin w3-hide"){
            extralogkey.innerHTML = "ᐁ extra";
            extraloggroup.className = "w3-margin";
        }else{
            extralogkey.innerHTML = "ᐅ extra";
            extraloggroup.className = "w3-margin w3-hide";
        }
    }
    extraloggroup.appendChild(exportVRMRotateButton);
    logbox.appendChild(extralogkey);
    logbox.appendChild(extraloggroup);

    // about the team
    let about = document.getElementById("about");
    about.innerHTML = "";
    about.style.color = "white";
    let alinks = [
        [getCMV("ORG_URL"), "OpenLive3D"],
        [getCMV("DOC_URL"), "Doc Repo - " + getCMV("VERSION")],
        [getCMV("REPO_URL"), "Code Repo - " + getCMV("DEV_DATE")],
        [getCMV("DISCORD_URL"), "Official Discord"]
    ];
    for(let i = 0; i < alinks.length; i ++){
        let alink = document.createElement("a");
        alink.href = alinks[i][0];
        alink.innerHTML = getL(alinks[i][1]);
        alink.setAttribute("target", "_blank");
        alink.setAttribute("rel", "noopener noreferrer");
        about.appendChild(alink);
        about.appendChild(document.createElement("br"));
    }

    console.log("gui layout initialized");
}

function createCameraLayout(){
    let videoselect = document.getElementById("videoselect");
    videoselect.innerHTML = "";
    listCameras(carr => {
        for(let cobj of carr){
            let option = document.createElement('option');
            option.value = cobj['id'];
            option.innerHTML = getL(cobj['name']);
            videoselect.appendChild(option);
        }
    });
}

function createMoodLayout(){
    // reset MoodLayout
    moodbar.innerHTML = "";
    let tmp = document.createElement("div");
    tmp.className = "w3-bar-item";
    tmp.style.height = "80px";
    tmp.style.color = "#0000";
    tmp.innerHTML = ".";
    moodbar.appendChild(tmp);

    // hand-on hand-no
    for(let i = 0; i < availableTrackingMode.length; i ++){
        let trackingmode = availableTrackingMode[i];
        let handdiv = document.createElement('div');
        handdiv.id = "handdiv_" + trackingmode;
        if(getCMV("UI_TRACKING_MODE_COLLAPSE")){
            handdiv.style.display = "none";
        }
        let handobj = document.createElement('img');
        handobj.id = "handobj_" + trackingmode;
        handobj.src = "asset/hand/" + trackingmode + "-2.png";
        handobj.style.width = "30px";
        handobj.style.cursor = "pointer";
        handobj.style.marginLeft = "12px";
        handobj.onclick = function(){
            if(getCMV("IN_TRACKING_MODE_SELECT") ||
                !getCMV("UI_TRACKING_MODE_COLLAPSE")){
                setCMV("TRACKING_MODE", trackingmode);
                setCMV("IN_TRACKING_MODE_SELECT", false);
                setTrackingModeSelect(trackingmode);
            }else{
                setCMV("IN_TRACKING_MODE_SELECT", true);
                displayAllTrackingMode();
            }
        }
        handdiv.appendChild(handobj);
        handdiv.appendChild(document.createElement("br"));
        handdiv.appendChild(document.createElement("br"));
        moodbar.appendChild(handdiv);

        if(i == availableTrackingMode.length - 1){
            setTrackingModeSelect(getCMV("TRACKING_MODE"));
        }
    }
    
    // mood
    let moods = getAllMoods();
    for(let i = 0; i < moods.length; i ++){
        let mood = moods[i];
        if(checkVRMMood(mood)){
            let mooddiv = document.createElement('div');
            mooddiv.id = "mooddiv_" + mood;
            if(getCMV("UI_MOOD_COLLAPSE")){
                mooddiv.style.display = "none";
            }
            let moodobj = document.createElement('img');
            moodobj.id = "moodobj_" + mood;
            moodobj.src = "asset/mood/" + mood + ".png";
            moodobj.style.width = "30px";
            moodobj.style.cursor = "pointer";
            moodobj.style.marginLeft = "12px";
            moodobj.onclick = function(){
                if(getCMV("IN_MOOD_SELECT") ||
                    !getCMV("UI_MOOD_COLLAPSE")){
                    setCMV("IN_MOOD_SELECT", false);
                    setMoodSelect(mood);
                    setMood(mood);
                }else{
                    setCMV("IN_MOOD_SELECT", true);
                    displayAllMood();
                }
            }
            mooddiv.appendChild(moodobj);
            mooddiv.appendChild(document.createElement("br"));
            mooddiv.appendChild(document.createElement("br"));
            moodbar.appendChild(mooddiv);
        }

        if(i == moods.length - 1){
            setMoodSelect(getCMV('DEFAULT_MOOD'));
        }
    }

    moodbar.onmouseout = function(e){
        if(e.target && e.relatedTarget &&
            !(e.target.id[7] == "_" && e.relatedTarget.id[7] == "_" &&
            e.target.id.slice(0, 4) == e.relatedTarget.id.slice(0, 4))){
            setCMV("IN_TRACKING_MODE_SELECT", false);
            setCMV("IN_MOOD_SELECT", false);
            setTrackingModeSelect(getCMV("TRACKING_MODE"));
            setMoodSelect(getCMV("MOOD"));
        }
    }
}

function displayAllTrackingMode(){
    for(let i = 0; i < availableTrackingMode.length; i ++){
        let trackingmode = availableTrackingMode[i];
        let handdiv = document.getElementById("handdiv_" + trackingmode);
        handdiv.style.display = "block";
    }
}

function displayAllMood(){
    let moods = getAllMoods();
    for(let i = 0; i < moods.length; i ++){
        let mood = moods[i];
        if(checkVRMMood(mood)){
            let mooddiv = document.getElementById("mooddiv_" + mood);
            mooddiv.style.display = "block";
        }
    }
}

function setTrackingModeSelect(newtrackingmode){
    for(let i = 0; i < availableTrackingMode.length; i ++){
        let trackingmode = availableTrackingMode[i];
        let handdiv = document.getElementById("handdiv_" + trackingmode);
        let handobj = document.getElementById("handobj_" + trackingmode);
        handobj.src = "asset/hand/" + trackingmode + "-2.png";
        if(getCMV("UI_TRACKING_MODE_COLLAPSE")){
            handdiv.style.display = "none";
        }else{
            handdiv.style.display = "block";
        }
    }
    let handobj = document.getElementById("handobj_" + newtrackingmode);
    let handdiv = document.getElementById("handdiv_" + newtrackingmode);
    if(handobj && handdiv){
        handobj.src = "asset/hand/" + newtrackingmode + ".png";
        if(getCMV("UI_TRACKING_MODE_COLLAPSE")){
            handdiv.style.display = "block";
        }
    }
}

function setMoodSelect(newmood){
    let moods = getAllMoods();
    for(let i = 0; i < moods.length; i ++){
        let mood = moods[i];
        if(checkVRMMood(mood)){
            let mooddiv = document.getElementById("mooddiv_" + mood);
            mooddiv.style.filter = "";
            if(getCMV("UI_MOOD_COLLAPSE")){
                mooddiv.style.display = "none";
            }else{
                mooddiv.style.display = "block";
            }
        }
    }
    let mooddiv = document.getElementById("mooddiv_" + newmood);
    if(mooddiv){
        mooddiv.style.filter = "invert(1)";
        if(getCMV("UI_MOOD_COLLAPSE")){
            mooddiv.style.display = "block";
        }
    }
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
        if(getCMV('CAMERA_FLIP')){
            dbg.translate(dbg.canvas.width, 0);
            dbg.scale(-getCMV('CANVAS_RATIO'), getCMV('CANVAS_RATIO'));
        }else{
            dbg.scale(getCMV('CANVAS_RATIO'), getCMV('CANVAS_RATIO'));
        }
        dbg.drawImage(image, 0, 0); // print the camera
        dbg.restore();
    }
}

const MARKCOLOR = {
    "head" : "#f00", // red
    "righteye" : "#7ff", // cyan
    "lefteye" : "#7ff", // cyan
    "mouth" : "#ff7", // yellow
    "rightbrow": "#f7f", // purple
    "leftbrow": "#f7f", // purple
    
    "elbow": "#ccc", // light-gray
    "shoulder": "#fff", // white
    "wrist": "#77f", // blue

    "leftpaw": "#0f0", // green
    "leftthumb": "#070", // dark-green
    "leftindex": "#070", // dark-green
    "leftmiddle": "#070", // dark-green
    "leftring": "#070", // dark-green
    "leftpinky": "#070", // dark-green

    "rightpaw": "#0f0", // green
    "rightthumb": "#070", // dark-green
    "rightindex": "#070", // dark-green
    "rightmiddle": "#070", // dark-green
    "rightring": "#070", // dark-green
    "rightpinky": "#070", // dark-green
};
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
        let logitems = getLogItems();
        for(let ikey of logitems){
            if(isVisible("logbox_" + ikey)){
                let logbox = document.getElementById("logbox_" + ikey);
                logbox.innerHTML = '';
                if(keys[ikey]){
                    Object.keys(keys[ikey]).forEach(function(key){
                        let jsonItem = document.createElement('text');
                        jsonItem.innerHTML = getL(key) + ": " + Math.floor(keys[ikey][key] * 1000) / 1000 + "<br/>";
                        jsonItem.style.color = "white";
                        logbox.appendChild(jsonItem);
                    });
                }else{
                    logbox.innerHTML = 'No ' + getL(ikey) + ' Detected';
                }
            }
        }
    }
}

function raiseAlert(vistate, mlstate){
    if(vistate > 0 || mlstate > 0){
        let alertbox = document.getElementById("alertbox");
        alertbox.style.display = "block";
        let alerttext = document.getElementById("alerttext");
        if(vistate == 3){
            alerttext.innerHTML = getL("ALERT: Full Screen / Wrong Tab<br/>Browser will stop rendering when other program enters full screen!");
        } else if(mlstate == 3){
            alerttext.innerHTML = getL("ALERT: Error<br/>ML loop stop running, might need to restart to validate.");
        } else if(mlstate == 2 || vistate == 2){
            alerttext.innerHTML = getL("ALERT: Hardware Acceleration<br/>ML loop is running extremely slow, check if hardware acceleration is opened.");
        } else if(mlstate == 1 && getCMV("HAND_TRACKING")){
            alerttext.innerHTML = getL("ALERT: Ultra Fast<br/>ML loop is running slowly, improve performance by using FACE-ONLY mode.");
        } else if(vistate == 1){
            alerttext.innerHTML = getL("ALERT: Slow<br/>Feel free to contact developer for more information.");
        }
    }
}

function clearAlert(vistate, mlstate){
    if(vistate == 0 && mlstate == 0){
        let alertbox = document.getElementById("alertbox");
        alertbox.style.display = "none";
    }
}

function drawScene(){
    if(getCMV('CAMERA_FLIP') != getCMV('SCENE_FLIP')){
        setCMV('SCENE_FLIP', getCMV('CAMERA_FLIP'));
        scene.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));
    }
    renderer.render(scene, camera);
}

function hideSideboxes(){
    for(let boxid of getSideBoxes()){
        let obj = document.getElementById(boxid);
        if(obj.className.indexOf("w3-hide") == -1){
            obj.className += " w3-hide";
        }
    }
}

function hideLoadbox(){
    let loadbox = document.getElementById('loadbox');
    loadbox.style.display = "none";
    loadbox.innerHTML = "";
    setCMV("LOADING_SCENE", false);
}

function drawMobile(){
    let loadbox = document.getElementById('loadinfo');
    loadbox.style.color = 'red';
    loadbox.innerHTML = getL("MOBILE NOT SUPPORTED!!");
    window.location.replace("mobile.html");
}

// https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
function drawSafari(){
    let loadbox = document.getElementById('loadinfo');
    loadbox.innerHTML = "";
    let tmp1 = document.createElement('p');
    tmp1.style.color = 'red';
    tmp1.innerHTML = getL("SAFARI NOT SUPPORTED!!");
    loadbox.appendChild(tmp1);
    let tmp2 = document.createElement('p');
    tmp2.innerHTML = getL("Safari has no stable support for image processing in web-worker today (2023-03-12)");
    tmp2.innerHTML += " " + getL("Please use other browsers for now.");
    loadbox.appendChild(tmp2);
}

function drawLoading(){
    let loadbox = document.getElementById('loadinfo');
    loadbox.innerHTML = "";
    if(checkVRMModel() && checkMLModel() && checkImage()){
        let checkintegrate = document.createElement('p');
        loadbox.appendChild(checkintegrate);
        checkintegrate.innerHTML = "⟳ " + getL("Integration Validating...");
        let tmp1 = document.createElement('p');
        loadbox.appendChild(tmp1);
        tmp1.innerHTML = ".";
        tmp1.style.color = "#0000";
        let tmp2 = document.createElement('p');
        loadbox.appendChild(tmp2);
        tmp2.innerHTML = ".";
        tmp2.style.color = "#0000";
    }else{
        let checkvrm = document.createElement('p');
        loadbox.appendChild(checkvrm);
        if(checkVRMModel()){
            checkvrm.innerHTML = "✅ " + getL("VRM-Model Loading...");
        }else{
            checkvrm.innerHTML = "⟳ " + getL("VRM-Model Loading...");
        }
        let checklm = document.createElement('p');
        loadbox.appendChild(checklm);
        if(checkMLModel()){
            checklm.innerHTML = "✅ " + getL("FaceLandMark-Model Loading...");
        }else{
            checklm.innerHTML = "⟳ " + getL("FaceLandMark-Model Loading...");
        }
        let checkcamera = document.createElement('p');
        loadbox.appendChild(checkcamera);
        if(checkImage()){
            checkcamera.innerHTML = "✅ " + getL("Camera Loading...");
        }else{
            checkcamera.innerHTML = "⟳ " + getL("Camera Loading...");
        }
    }
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

function displayObj(target){
    let obj = document.getElementById(target);
    if(obj.style.display == "none"){
        obj.style.display = "block";
    }else{
        obj.style.display = "none";
    }
}
