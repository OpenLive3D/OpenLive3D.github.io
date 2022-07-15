let configManager = {};

function getCM(){
    if(Object.keys(configManager).length === 0){
        initCM();
    }
    return configManager;
}

function saveCM(){
    document.cookie = JSON.stringify(configManager);
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
        configManager['BG_COLOR'] = "#0F0";
        configManager['CAMERA_FLIP'] = true;
        configManager['BREATH_FREQUENCY'] = 0.3;
        configManager['BREATH_STRENGTH'] = 1;
        configManager['NECK_RATIO'] = 0.55;
        configManager['CHEST_RATIO'] = 0.45;
        configManager['BODY_STABLIZE_RATIO'] = 0.7;
        configManager['MOUTH_RATIO'] = 7;
        configManager['MOUTH_STABLIZE_RATIO'] = 0.01;
        configManager['EYE_LINK_THRESHOLD'] = 0.07;
        configManager['EYE_STABLIZE_RATIO'] = 0.2;
        configManager['IRIS_POS_OFFSET'] = 0.0;
        configManager['IRIS_POS_RATIO'] = 5.0;
        configManager['RIGHT_EYE_CLOSE_THRESHOLD'] = 0.27;
        configManager['RIGHT_EYE_OPEN_THRESHOLD'] = 0.32;
        configManager['RIGHT_EYE_SQUINT_RATIO'] = 0.6;
        configManager['LEFT_EYE_CLOSE_THRESHOLD'] = 0.27;
        configManager['LEFT_EYE_OPEN_THRESHOLD'] = 0.32;
        configManager['LEFT_EYE_SQUINT_RATIO'] = 0.6;
    }
    // System Parameters
    configManager['MODEL'] = 'https://pixiv.github.io/three-vrm/packages/three-vrm/examples/models/three-vrm-girl.vrm';
    configManager['VERSION'] = "Alpha.0.3.7";
    configManager['DEV_DATE'] = "2022-07-15";
    configManager['ORG_URL'] = "https://github.com/OpenLive3D";
    configManager['REPO_URL'] = "https://github.com/OpenLive3D/OpenLive3D.github.io";
    configManager['DOC_URL'] = "https://github.com/OpenLive3D/OpenLive3D.document";
    configManager['TIME'] = new Date();
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
    configManager['MOOD_JOY'] = false;
    configManager['MOOD_NEUTRAL'] = true;
}

function getSR(key){
    if(key == "body"){
        return configManager['BODY_STABLIZE_RATIO'];
    }else if(key == "eye"){
        return configManager['EYE_STABLIZE_RATIO'];
    }else if(key == "mouth"){
        return configManager['MOUTH_STABLIZE_RATIO'];
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
        saveCM();
        return true;
    }
    return false;
}

function getBinaryCM(){
    return ["CAMERA_FLIP", 'MOOD_ANGRY', 'MOOD_SORROW',
        'MOOD_FUN', 'MOOD_JOY', 'MOOD_NEUTRAL'];
}

function getConfigModifiers(){
    return {
        'GENERAL': [{
            'key': 'BG_COLOR',
            'title': 'Background Color',
            'describe': 'Accept Color Code with "#" or "rgba", "hsla"'
        }, {
            'key': 'CAMERA_FLIP',
            'title': 'Camera Flip',
            'describe': 'Flip the camera horizontally. Accept "true|false" value',
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
        }],
        'BODY': [{
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
            'key': 'BODY_STABLIZE_RATIO',
            'title': 'Body Stablize Ratio',
            'describe': 'Motion become more stable with larger value, but small guesture become harder to track. Avatar stop moving when the value is 1. Range(0, 0.95)',
            'range': [0, 0.95]
        }],
        'MOUTH': [{
            'key': 'MOUTH_RATIO',
            'title': 'Mouth Open Ratio',
            'describe': 'The multiplication parameter for mouth openness. Range(0, 20)',
            'range': [0, 20]
        }, {
            'key': 'MOUTH_STABLIZE_RATIO',
            'title': 'Mouth Stablize Ratio',
            'describe': 'Motion become more stable with larger value, but small guesture become harder to track. Avatar stop moving when the value is 1. Range(0, 0.95)',
            'range': [0, 0.95]
        }],
        'EYE_GENERAL': [{
            'key': 'EYE_LINK_THRESHOLD',
            'title': 'Eyes Link',
            'describe': 'The threshold that control the coherent of the 2 eyes. When the absolute difference of the 2 eyes openness is smaller then the value, the 2 eyes will move together. Range(0, 1)',
            'range': [0, 1]
        }, {
            'key': 'EYE_STABLIZE_RATIO',
            'title': 'Eye Stablize Ratio',
            'describe': 'Motion become more stable with larger value, but small guesture become harder to track. Avatar stop moving when the value is 1. Range(0, 0.95)',
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
        }]
    };
}
