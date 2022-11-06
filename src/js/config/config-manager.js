// version configuration
const DEV_DATE = "2022-11-06";
const VERSION = "Beta.1.1.11";
const CONFIG_VERSION = "Beta.1.1.7";

let configManager = {};

function versionValidation(v){
    if(VERSION == v){
        return true;
    }else if(v){
        let varr1 = CONFIG_VERSION.split(".");
        let varr2 = v.split(".");
        if(varr1[0] == varr2[0]){
            for(let i = 1; i < varr1.length; i++){
                if(parseInt(varr1[i]) > parseInt(varr2[i])){
                    return false;
                }
            }
            return true;
        }
    }
    return false;
}

function getCM(){
    if(Object.keys(configManager).length === 0){
        initCM();
    }
    return configManager;
}

function saveCM(){
    document.cookie = JSON.stringify(configManager);
    console.log("setting saved");
}

function loadCM(){
    if(document.cookie){
        let cuti = document.cookie.indexOf("{");
        if(cuti == -1){
            return false;
        }else{
            let cookie = document.cookie.substring(cuti);
            try{
                configManager = JSON.parse(cookie);
                if(!versionValidation(configManager['VERSION'])){
                    return false;
                }
                if(!("MODEL" in configManager)){
                    return false;
                }
                let checkModifiers = getConfigModifiers();
                for(let key in checkModifiers){
                    let cmk = checkModifiers[key];
                    for(let i = 0; i < cmk.length; i ++){
                        if(!(cmk[i]['key'] in configManager)){
                            return false;
                        }
                    }
                }
                return true;
            }catch(e){
                console.log(e);
                console.log(cookie);
                return false;
            }
        }
    }else{
        return false;
    }
}

function initCM(){
    if(loadCM()){
        console.log("Load Cookie Config");
    }else{
        // Modifiable Parameters
        console.log("Initial Config");
        configManager['MODEL'] = 'https://openlive3d.com/asset/vrm/three-vrm-girl.vrm';
        configManager['CUSTOM_MODEL'] = false;
        configManager['SAVE_SETTING'] = false;
        configManager['BG_COLOR'] = "#00CC00";
        configManager['CAMERA_FLIP'] = true;
        configManager['BREATH_FREQUENCY'] = 0.3;
        configManager['BREATH_STRENGTH'] = 1;
        configManager['MOOD_AUTO_RATIO'] = 4;
        configManager['MOOD_AUTO_OFFSET'] = 0.04;
        configManager['SENSITIVITY_SCALE'] = 1;
        configManager['MOTION_BLUR_RATIO'] = 1.5;
        configManager['MOMENTUM_RATIO'] = 1.5;
        configManager['HEAD_RATIO'] = 0.50;
        configManager['NECK_RATIO'] = 0.40;
        configManager['CHEST_RATIO'] = 0.1;
        configManager['HEAD_STABLIZE_RATIO'] = 0.3;
        configManager['BODY_STABLIZE_RATIO'] = 0.7;
        configManager['MOUTH_OPEN_OFFSET'] = 0.015;
        configManager['MOUTH_RATIO'] = 5;
        configManager['MOUTH_STABLIZE_RATIO'] = 0.01;
        configManager['BROWS_OFFSET'] = 0.49;
        configManager['BROWS_RATIO'] = 10;
        configManager['BROWS_STABLIZE_RATIO'] = 0.01;
        configManager['EYE_SYNC'] = true;
        configManager['EYE_LINK_THRESHOLD'] = 0.05;
        configManager['EYE_STABLIZE_RATIO'] = 0.2;
        configManager['IRIS_POS_OFFSET'] = 0.0;
        configManager['IRIS_POS_RATIO'] = 0.5;
        configManager['RIGHT_EYE_CLOSE_THRESHOLD'] = 0.20;
        configManager['RIGHT_EYE_OPEN_THRESHOLD'] = 0.27;
        configManager['RIGHT_EYE_SQUINT_RATIO'] = 0.6;
        configManager['LEFT_EYE_CLOSE_THRESHOLD'] = 0.20;
        configManager['LEFT_EYE_OPEN_THRESHOLD'] = 0.27;
        configManager['LEFT_EYE_SQUINT_RATIO'] = 0.6;
        configManager['HAND_TRACKING'] = true;
        configManager['HAND_STABLIZE_RATIO'] = 0.05;
        configManager['FINGER_GRIP_RATIO'] = 1.0;
        configManager['FINGER_SPREAD_RATIO'] = 1.5;
        configManager['POSITION_X_RATIO'] = 0.12;
        configManager['POSITION_Y_RATIO'] = 0.12;
        configManager['POSITION_Z_RATIO'] = 0.12;
    }
    // System Parameters
    configManager['VERSION'] = VERSION;
    configManager['DEV_DATE'] = DEV_DATE;
    configManager['ORG_URL'] = "https://github.com/OpenLive3D";
    configManager['REPO_URL'] = "https://github.com/OpenLive3D/OpenLive3D.github.io";
    configManager['DOC_URL'] = "https://github.com/OpenLive3D/OpenLive3D.document";
    configManager['DISCORD_URL'] = "https://discord.gg/pGPY5Jfhvz";
    configManager['BG_UPLOAD'] = "";
    configManager['TIME'] = new Date();
    configManager['FPS_RATE'] = 60;
    configManager['HEALTH_RATE'] = 1;
    configManager['HEALTH_WAIT'] = 5;
    configManager['MIN_VI_DURATION'] = 3;
    configManager['MAX_VI_DURATION'] = 300;
    configManager['HAND_CHECK'] = 3;
    configManager['MAX_FACES'] = 1;
    configManager['NUM_KEYPOINTS'] = 468;
    configManager['NUM_IRIS_KEYPOINTS'] = 5;
    configManager['PREDICT_IRISES'] = true;
    configManager['SCENE_FLIP'] = false;
    configManager['CANVAS_RATIO'] = 0.5;
    configManager['DEBUG_IMAGE'] = false;
    configManager['DEBUG_LANDMARK'] = true;
    configManager['MOOD_ANGRY'] = true;
    configManager['MOOD_SORROW'] = true;
    configManager['MOOD_FUN'] = true;
    configManager['MOOD_JOY'] = true;
    configManager['MOOD_SURPRISED'] = true;
    configManager['MOOD_RELAXED'] = true;
    configManager['MOOD_NEUTRAL'] = true;
    configManager['MOOD_AUTO'] = true;
    configManager['DEFAULT_MOOD'] = "auto";
    configManager['MOOD_EXTRA_LIMIT'] = 10;
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
            saveCM();
        }
        return true;
    }
    return false;
}

function getBinaryCM(){
    return ['SAVE_SETTING', 'CAMERA_FLIP',
        'HAND_TRACKING', "EYE_SYNC",
        'MOOD_ANGRY', 'MOOD_SORROW',
        'MOOD_FUN', 'MOOD_JOY',
        'MOOD_NEUTRAL', 'MOOD_AUTO'];
}

function getLogItems(){
    return ["face", "pose", "left_hand", "right_hand"];
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

function setLogAPI(data){
    try{
        let request = new XMLHttpRequest();
        request.open('POST', 'https://2bbb76lqd1.execute-api.us-east-1.amazonaws.com/dev/openlive3d_s3_put_log', false);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify(data));
        request.onreadystatechange=function(){
            console.log(request);
        }
    }catch(err){
        console.log("API Call Error");
    }
}
