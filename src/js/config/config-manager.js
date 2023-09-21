// version configuration
const DEV_DATE = "2023-09-15";
const VERSION = "w.2.1.1";
const CONFIG_VERSION = "Beta.1.2.12";

let configManager = {};
function getCookie(){
    return document.cookie;
}
function setCookie(saveString){
    document.cookie = saveString;
}

let defaultConfig = {
    // modifiable parameters
    'MODEL': 'https://openlive3d.com/asset/vrm/three-vrm-girl.vrm',
    'CUSTOM_MODEL': false,
    'SAVE_SETTING': false,
    'LANGUAGE': 'en',
    'MULTI_THREAD': true,
    'BG_COLOR': "#00CC00",
    'BG_UPLOAD': "",
    'CAMERA_FLIP': true,
    'BREATH_FREQUENCY': 0.3,
    'BREATH_STRENGTH': 1,
    'MOOD_AUTO_RATIO': 4,
    'MOOD_AUTO_OFFSET': 0.04,
    '3D_FPS_LIMIT': 120,
    'ML_FPS_LIMIT': 120,
    'SENSITIVITY_SCALE': 1,
    'MOTION_BLUR_RATIO': 1.5,
    'MOMENTUM_RATIO': 1.5,
    'HEAD_RATIO': 0.50,
    'NECK_RATIO': 0.40,
    'CHEST_RATIO': 0.1,
    'HEAD_STABLIZE_RATIO': 0.3,
    'BODY_STABLIZE_RATIO': 0.7,
    'MOUTH_OPEN_OFFSET': 0.015,
    'MOUTH_RATIO': 5,
    'MOUTH_STABLIZE_RATIO': 0.01,
    'BROWS_OFFSET': 0.49,
    'BROWS_RATIO': 10,
    'BROWS_STABLIZE_RATIO': 0.01,
    'EYE_SYNC': true,
    'EYE_LINK_THRESHOLD': 0.05,
    'EYE_STABLIZE_RATIO': 0.2,
    'IRIS_POS_OFFSET': 0.0,
    'IRIS_POS_RATIO': 0.5,
    'RIGHT_EYE_CLOSE_THRESHOLD': 0.20,
    'RIGHT_EYE_OPEN_THRESHOLD': 0.25,
    'RIGHT_EYE_SQUINT_RATIO': 0.6,
    'LEFT_EYE_CLOSE_THRESHOLD': 0.20,
    'LEFT_EYE_OPEN_THRESHOLD': 0.25,
    'LEFT_EYE_SQUINT_RATIO': 0.6,
    'HAND_TRACKING': true,
    'HAND_STABLIZE_RATIO': 0.05,
    'FINGER_GRIP_RATIO': 1.0,
    'FINGER_SPREAD_RATIO': 1.5,
    'POSITION_X_RATIO': 0.12,
    'POSITION_Y_RATIO': 0.12,
    'POSITION_Z_RATIO': 0.12,
    // system parameters
    'VERSION': VERSION,
    'DEV_DATE': DEV_DATE,
    'DEFAULT_MODEL': 'https://openlive3d.com/asset/vrm/three-vrm-girl.vrm',
    'ORG_URL': "https://github.com/OpenLive3D",
    'REPO_URL': "https://github.com/OpenLive3D/OpenLive3D.github.io",
    'DOC_URL': "https://github.com/OpenLive3D/OpenLive3D.document",
    'DISCORD_URL': "https://discord.gg/pGPY5Jfhvz",
    'TIME': new Date(),
    'FPS_RATE': 60,
    'FPS_WAIT': 10,
    'HEAD_HAND_RATIO': 0.2,
    'HEALTH_RATE': 1,
    'HEALTH_WAIT': 5,
    'MIN_VI_DURATION': 3,
    'MAX_VI_DURATION': 300,
    'MIN_ML_DURATION': 3,
    'MAX_ML_DURATION': 300,
    'HAND_CHECK': 3,
    'MAX_FACES': 1,
    'NUM_KEYPOINTS': 468,
    'NUM_IRIS_KEYPOINTS': 5,
    'PREDICT_IRISES': true,
    'SCENE_FLIP': false,
    'CANVAS_RATIO': 0.5,
    'DEBUG_IMAGE': false,
    'DEBUG_LANDMARK': true,
    'MOOD_ANGRY': true,
    'MOOD_SORROW': true,
    'MOOD_FUN': true,
    'MOOD_JOY': true,
    'MOOD_SURPRISED': true,
    'MOOD_RELAXED': true,
    'MOOD_NEUTRAL': true,
    'MOOD_AUTO': true,
    'DEFAULT_MOOD': "auto",
    'MOOD_EXTRA_LIMIT': 10,
    'VRM_XR': 1,
    'VRM_YR': 1,
    'VRM_ZR': 1,
    'DYNA_VI_DURATION': 3,
    'DYNA_ML_DURATION': 3,
    'VI_LOOP_COUNTER': 0,
    'ML_LOOP_COUNTER': 0,
    'GOOD_TO_GO': false,
    'LOADING_SCENE': true,
    'MOOD': "auto",
    'CURRENT_CAMERA_ID': "",
    'RESET_CAMERA': false,
    'INTEGRATION_SUBMODULE_PATH': "ol3dc",
    'TEST_MOBILE_ENTRY': false
};
function getDefaultCMV(key){
    return defaultConfig[key];
}
function getSystemParameters(){
    return ['VERSION', 'DEV_DATE', 'DEFAULT_MODEL', 'ORG_URL',
        'REPO_URL', 'DOC_URL', 'DISCORD_URL',
        'TIME', 'FPS_RATE', 'FPS_WAIT', 'HEAD_HAND_RATIO',
        'HEALTH_RATE', 'HEALTH_WAIT', 'MIN_VI_DURATION',
        'MAX_VI_DURATION', 'MIN_ML_DURATION', 'MAX_ML_DURATION',
        'HAND_CHECK', 'MAX_FACES', 'NUM_KEYPOINTS',
        'NUM_IRIS_KEYPOINTS', 'PREDICT_IRISES', 'SCENE_FLIP',
        'CANVAS_RATIO', 'DEBUG_IMAGE', 'DEBUG_LANDMARK',
        'MOOD_ANGRY', 'MOOD_SORROW', 'MOOD_FUN', 'MOOD_JOY',
        'MOOD_SURPRISED', 'MOOD_RELAXED', 'MOOD_NEUTRAL',
        'MOOD_AUTO', 'DEFAULT_MOOD', 'MOOD_EXTRA_LIMIT',
        'VRM_XR', 'VRM_YR', 'VRM_ZR',
        'DYNA_VI_DURATION', 'DYNA_ML_DURATION',
        'VI_LOOP_COUNTER', 'ML_LOOP_COUNTER',
        'GOOD_TO_GO', 'LOADING_SCENE', 'MOOD',
        'CURRENT_CAMERA_ID', 'RESET_CAMERA',
        'INTEGRATION_SUBMODULE_PATH', 'TEST_MOBILE_ENTRY'];
}
function getSavedSystemParameters(){
    return ['VERSION', 'DEV_DATE'];
}

function versionValidation(v){
    if(VERSION == v){
        return true;
    }else if(v){
        let varr1 = CONFIG_VERSION.split(".");
        let varr2 = v.split(".");
        for(let i = 1; i < varr1.length; i++){
            if(parseInt(varr1[i]) > parseInt(varr2[i])){
                return false;
            }else if(parseInt(varr1[i]) < parseInt(varr2[i])){
                return true;
            }
        }
        return true;
    }
    return false;
}

function saveCM(){
    let tmpCM = {};
    for(let key in configManager){
        if(!getSystemParameters().includes(key) ||
            getSavedSystemParameters().includes(key)){
            tmpCM[key] = configManager[key];
        }
    }
    setCookie(JSON.stringify(tmpCM));
    console.log("setting saved", tmpCM);
}

function clearCM(){
    setCookie(null);
    console.log("cookie cleared");
}

function loadCMFalse(){
    clearCM();
    return false;
}

function loadCM(){
    let cookie = getCookie();
    if(cookie){
        let cuti = cookie.indexOf("{");
        let cutl = cookie.indexOf("}");
        if(cuti == -1 || cutl == -1 || cutl < cuti){
            return loadCMFalse();
        }else{
            cookie = cookie.substring(cuti, cutl+1);
            setCookie(cookie);
            try{
                configManager = JSON.parse(cookie);
                if(!versionValidation(configManager['VERSION'])){
                    return loadCMFalse();
                }
                if(!("MODEL" in configManager)){
                    return loadCMFalse();
                }
                if(!("SAVE_SETTING" in configManager)){
                    return loadCMFalse();
                }else if(!configManager['SAVE_SETTING']){
                    console.log("No Save Setting");
                    return loadCMFalse();
                }
                let checkModifiers = getConfigModifiers();
                let checkCounter = 0;
                let checkFalseCounter = 0;
                for(let key in checkModifiers){
                    let cmk = checkModifiers[key];
                    for(let i = 0; i < cmk.length; i ++){
                        checkCounter += 1;
                        if(!(cmk[i]['key'] in configManager)){
                            let cmkey = cmk[i]['key'];
                            configManager[cmkey] = getDefaultCMV(cmkey);
                            checkFalseCounter += 1;
                            console.log("config missing key ", cmkey);
                        }
                    }
                }
                if(checkFalseCounter > checkCounter / 4){
                    console.log("config false counter too many");
                    return loadCMFalse();
                }
                return true;
            }catch(e){
                console.log(e);
                console.log(cookie);
                return loadCMFalse();
            }
        }
    }else{
        return loadCMFalse();
    }
}

function initConfig(){
    if(loadCM()){
        console.log("Load Cookie Config");
        // System Parameters
        for(let key of getSystemParameters()){
            configManager[key] = getDefaultCMV(key);
        }
    }else{
        // Modifiable Parameters
        console.log("Initial Config");
        configManager = JSON.parse(JSON.stringify(defaultConfig));
    }
}

function getSR(key){
    if(key == "head"){
        return configManager['HEAD_STABLIZE_RATIO'];
    }else if(key == "eye"){
        return configManager['EYE_STABLIZE_RATIO'];
    }else if(key == "mouth"){
        return configManager['MOUTH_STABLIZE_RATIO'];
    }else if(key == "brows"){
        return configManager['BROWS_STABLIZE_RATIO'];
    }else if(key == "hand"){
        return configManager['HAND_STABLIZE_RATIO'];
    }else{
        return configManager['BODY_STABLIZE_RATIO'];
    }
}

function getCMV(key){
    return configManager[key];
}

function setCMV(key, value){
    if(key in configManager){
        configManager[key] = value;
        if(configManager['SAVE_SETTING']){
            if(!getSystemParameters().includes(key)){
                saveCM();
            }
        }else{
            clearCM();
        }
        return true;
    }
    return false;
}

function addCMV(key, value){
    if(key in configManager){
        configManager[key] += value;
        return true;
    }
    return false;
}

function getBinaryCM(){
    return ['SAVE_SETTING', 'CAMERA_FLIP',
        'HAND_TRACKING', "EYE_SYNC",
        'MOOD_ANGRY', 'MOOD_SORROW',
        'MOOD_FUN', 'MOOD_JOY',
        'MOOD_NEUTRAL', 'MOOD_AUTO',
        'MULTI_THREAD'];
}

function getSideBoxes(){
    return ["vrmbox", "dbgbox", "confbox", "logbox"];
}

function getLogItems(){
    return ["general", "face", "pose", "left_hand", "right_hand"];
}

function getConfigModifiers(){
    return {
        'GENERAL': [{
            'key': 'SAVE_SETTING',
            'title': 'Save Setting',
            'describe': 'Save your settings in your browser as the cookie.',
            'valid': [true, false]
        }, {
            'key': 'CAMERA_FLIP',
            'title': 'Camera Flip',
            'describe': 'Flip the camera horizontally.',
            'valid': [true, false]
        }, {
            'key': 'LANGUAGE',
            'title': 'Language',
            'describe': 'Select the language for the user interface.',
            'valid': ['en', 'zh']
        }, {
            'key': 'BREATH_FREQUENCY',
            'title': 'Breath Frequency',
            'describe': 'Breath count per second, default as 0.3. Range(0, 4)',
            'range': [0, 4]
        }, {
            'key': 'BREATH_STRENGTH',
            'title': 'Breath Strength',
            'describe': 'The moving length of breathing effect, default as 1. Range(0, 10)',
            'range': [0, 10]
        }, {
            'key': 'MOOD_AUTO_RATIO',
            'title': 'MOOD_AUTO Ratio',
            'describe': 'The dramatic-degree of the auto-mood detection, default as 2. Range(0, 10)',
            'range': [0, 10]
        }, {
            'key': 'MOOD_AUTO_OFFSET',
            'title': 'MOOD_AUTO Offset',
            'describe': 'Auto-mood works when the value is larger than the offset, default as 0.1. Range(0, 1)',
            'range': [0, 1]
        }, {
            'key': '3D_FPS_LIMIT',
            'title': '3D_FPS Limit',
            'describe': 'The FPS limit for 3D rendering visualization, default as 120. Range(1, 120)',
            'range': [1, 120]
        }, {
            'key': 'ML_FPS_LIMIT',
            'title': 'ML_FPS Limit',
            'describe': 'The FPS limit for ML computation, default as 120. Range(1, 120)',
            'range': [1, 120]
        }, {
            'key': 'MULTI_THREAD',
            'title': 'Multi Thread Option',
            'describe': 'Select to use multi-thread or not',
            'valid': [true, false]
        }],
        'BACKGROUND': [{
            'key': 'BG_COLOR',
            'title': 'Background Color',
            'describe': 'Accept Color Code with "#" or "rgba", "hsla"'
        }, {
            'key': 'BG_UPLOAD',
            'title': 'Upload Image',
            'describe': 'Upload an image as your background'
        }],
        'SMOOTH': [{
            'key': 'SENSITIVITY_SCALE',
            'title': 'Sensitivity Scale',
            'describe': 'The higher this value is, the more overall sensitive it is to human movement, default as 1. Range(0.1, 3).',
            'range': [0.1, 3]
        }, {
            'key': 'MOTION_BLUR_RATIO',
            'title': 'Motion Blur Ratio',
            'describe': 'The higher this value is, the smoother the body motion is, default as 1.5. Range(0, 10).',
            'range': [0, 10]
        }, {
            'key': 'MOMENTUM_RATIO',
            'title': 'Momentum Ratio',
            'describe': 'The higher this value is, the smoother the body motion is, default as 1.5. Range(0, 10).',
            'range': [0, 10]
        }],
        'BODY': [{
            'key': 'HEAD_RATIO',
            'title': 'Head Rotate Ratio',
            'describe': 'The multiplication parameter to rotate the head as the head rotation. Range(-2, 2)',
            'range': [-2, 2]
        }, {
            'key': 'NECK_RATIO',
            'title': 'Neck Rotate Ratio',
            'describe': 'The multiplication parameter to rotate the neck as the head rotation. Range(-2, 2)',
            'range': [-2, 2]
        }, {
            'key': 'CHEST_RATIO',
            'title': 'Chest Rotate Ratio',
            'describe': 'The multiplication parameter to rotate the chest as the head rotation. Range(-2, 2)',
            'range': [-2, 2]
        }, {
            'key': 'HEAD_STABLIZE_RATIO',
            'title': 'Head Stablize Ratio',
            'describe': 'Motion become more stable with larger value, but small gesture become harder to track. Avatar stop moving when the value is 1. Range(0, 0.95)',
            'range': [0, 0.95]
        }, {
            'key': 'BODY_STABLIZE_RATIO',
            'title': 'Body Stablize Ratio',
            'describe': 'Motion become more stable with larger value, but small gesture become harder to track. Avatar stop moving when the value is 1. Range(0, 0.95)',
            'range': [0, 0.95]
        }],
        'MOUTH': [{
            'key': 'MOUTH_OPEN_OFFSET',
            'title': 'Mouth Open Offset',
            'describe': 'Mouth will only open after the openness value is larger than the offset. Range(0, 1)',
            'range': [0, 1]
        }, {
            'key': 'MOUTH_RATIO',
            'title': 'Mouth Open Ratio',
            'describe': 'The multiplication parameter for mouth openness. Range(0, 20)',
            'range': [0, 20]
        }, {
            'key': 'MOUTH_STABLIZE_RATIO',
            'title': 'Mouth Stablize Ratio',
            'describe': 'Motion become more stable with larger value, but small gesture become harder to track. Avatar stop moving when the value is 1. Range(0, 0.95)',
            'range': [0, 0.95]
        }],
        'BROWS': [{
            'key': 'BROWS_OFFSET',
            'title': 'Brows Open Offset',
            'describe': 'Brows will only open after the openness value is larger than the offset. Range(0, 1)',
            'range': [0, 1]
        }, {
            'key': 'BROWS_RATIO',
            'title': 'Brows Open Ratio',
            'describe': 'The multiplication parameter for brows openness. Range(0, 20)',
            'range': [0, 20]
        }, {
            'key': 'BROWS_STABLIZE_RATIO',
            'title': 'Brows Stablize Ratio',
            'describe': 'Motion become more stable with larger value, but small gesture become harder to track. Avatar stop moving when the value is 1. Range(0, 0.95)',
            'range': [0, 0.95]
        }],
        'EYE_GENERAL': [{
            'key': 'EYE_SYNC',
            'title': 'Eyes Sync',
            'describe': 'Force the eyes to sync or not. Accept "true|false" value',
            'valid': [true, false]
        }, {
            'key': 'EYE_LINK_THRESHOLD',
            'title': 'Eyes Link',
            'describe': 'The threshold that control the coherent of the 2 eyes. When the absolute difference of the 2 eyes openness is smaller then the value, the 2 eyes will move together. Range(0, 1)',
            'range': [0, 1]
        }, {
            'key': 'EYE_STABLIZE_RATIO',
            'title': 'Eye Stablize Ratio',
            'describe': 'Motion become more stable with larger value, but small gesture become harder to track. Avatar stop moving when the value is 1. Range(0, 0.95)',
            'range': [0, 0.95]
        }, {
            'key': 'IRIS_POS_OFFSET',
            'title': 'Iris Offset',
            'describe': 'The offset of iris turning, default 0.0. Range(-1, 1)',
            'range': [0, 2]
        }, {
            'key': 'IRIS_POS_RATIO',
            'title': 'Iris Ratio',
            'describe': 'The ratio of iris turning speed, default 5.0. Range(0, 20)',
            'range': [0, 20]
        }],
        'EYE_RIGHT': [{
            'key': 'RIGHT_EYE_CLOSE_THRESHOLD',
            'title': 'Right Eye Close',
            'describe': 'Close the eye when the openness is small than the threshold. Range(0, 1)',
            'range': [0, 1]
        }, {
            'key': 'RIGHT_EYE_OPEN_THRESHOLD',
            'title': 'Right Eye Open',
            'describe': 'Fully open the eye when the openness is larger than the threshold. Range(0, 1)',
            'range': [0, 1]
        }, {
            'key': 'RIGHT_EYE_SQUINT_RATIO',
            'title': 'Right Eye Squint',
            'describe': 'The ratio of half-open eye between fully open and close. Range(0, 1)',
            'range': [0, 1]
        }],
        'EYE_LEFT': [{
            'key': 'LEFT_EYE_CLOSE_THRESHOLD',
            'title': 'Left Eye Close',
            'describe': 'Close the eye when the openness is small than the threshold. Range(0, 1)',
            'range': [0, 1]
        }, {
            'key': 'LEFT_EYE_OPEN_THRESHOLD',
            'title': 'Left Eye Open',
            'describe': 'Fully open the eye when the openness is larger than the threshold. Range(0, 1)',
            'range': [0, 1]
        }, {
            'key': 'LEFT_EYE_SQUINT_RATIO',
            'title': 'Left Eye Squint',
            'describe': 'The ratio of half-open eye between fully open and close. Range(0, 1)',
            'range': [0, 1]
        }],
        'HAND': [{
            'key': 'HAND_TRACKING',
            'title': 'Hand Tracking',
            'describe': 'Hand tracking is enabled or not.',
            'valid': [true, false]
        }, {
            'key': 'HAND_STABLIZE_RATIO',
            'title': 'Hand Stablize Ratio',
            'describe': 'Motion become more stable with larger value, but small gesture become harder to track. Avatar stop moving when the value is 1. Range(0, 0.95)',
            'range': [0, 0.95]
        }, {
            'key': 'FINGER_GRIP_RATIO',
            'title': 'Finger Grip Ratio',
            'describe': 'Control the grip ratio of fingers. Default to 1. Range(0, 5)',
            'range': [0, 5]
        }, {
            'key': 'FINGER_SPREAD_RATIO',
            'title': 'Finger Spread Ratio',
            'describe': 'Control the spread ratio of fingers. Default to 1. Range(0, 5)',
            'range': [0, 5]
        }],
        'POSITION': [{
            'key': 'POSITION_X_RATIO',
            'title': 'Position X Ratio',
            'describe': 'The larger the number is, the faster the VRM model move horizontally. Range(-1, 1)',
            'range': [-1, 1]
        }, {
            'key': 'POSITION_Y_RATIO',
            'title': 'Position Y Ratio',
            'describe': 'The larger the number is, the faster the VRM model move vertically. Range(-1, 1)',
            'range': [-1, 1]
        }, {
            'key': 'POSITION_Z_RATIO',
            'title': 'Position Z Ratio',
            'describe': 'The larger the number is, the faster the VRM model move forward and backward. Range(-1, 1)',
            'range': [-1, 1]
        }]
    };
}

function setLogAPI(){
    try{
        let request = new XMLHttpRequest();
        request.open('POST', 'https://2bbb76lqd1.execute-api.us-east-1.amazonaws.com/dev/openlive3d_s3_put_log', false);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify(configManager));
        request.onreadystatechange=function(){
            console.log(request);
        }
    }catch(err){
        console.log("API Call Error");
    }
}
