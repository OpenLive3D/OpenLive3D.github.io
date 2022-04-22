let configManager = {};

function getCM(){
    if(Object.keys(configManager).length === 0){
        initCM();
    }
    return configManager;
}

function initCM(){
    // System Parameters
    configManager['TIME'] = new Date();
    configManager['MODEL'] = 'https://pixiv.github.io/three-vrm/packages/three-vrm/examples/models/three-vrm-girl.vrm';
    configManager['MAX_FACES'] = 1;
    configManager['NUM_KEYPOINTS'] = 468;
    configManager['NUM_IRIS_KEYPOINTS'] = 5;
    configManager['PREDICT_IRISES'] = true;
    configManager['SCENE_FLIP'] = false;
    configManager['CANVAS_RATIO'] = 0.5;
    configManager['VERSION'] = "Alpha.0.1.1";
    configManager['DEV_DATE'] = "2022-04-18";
    // Modifiable Parameters
    configManager['BG_COLOR'] = "#00F";
    configManager['MOUTH_RATIO'] = 3;
    configManager['CHEST_RATIO'] = 0.3;
    configManager['EYE_LINK_THRESHOLD'] = 0.07;
    configManager['RIGHT_EYE_CLOSE_THRESHOLD'] = 0.27;
    configManager['LEFT_EYE_CLOSE_THRESHOLD'] = 0.27;
    configManager['RIGHT_EYE_OPEN_THRESHOLD'] = 0.32;
    configManager['LEFT_EYE_OPEN_THRESHOLD'] = 0.32;
    configManager['RIGHT_EYE_SQUINT_RATIO'] = 0.6;
    configManager['LEFT_EYE_SQUINT_RATIO'] = 0.6;
    configManager['IRIS_POS_OFFSET'] = 0.0;
    configManager['IRIS_POS_RATIO'] = 5.0;
    configManager['BODY_STABLIZE_RATIO'] = 0.7;
    configManager['EYE_STABLIZE_RATIO'] = 0.2;
    configManager['MOUTH_STABLIZE_RATIO'] = 0.1;
    configManager['CAMERA_FLIP'] = true;
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
        return true;
    }
    return false;
}

function getConstModifier(){
    return [
        ['BG_COLOR', 'Background Color'],
        ['MOUTH_RATIO', 'Mouth Open Ratio'],
        ['CHEST_RATIO', 'Chest Movement Ratio'],
        ['EYE_LINK_THRESHOLD', 'Link Eyes Threshold'],
        ['RIGHT_EYE_CLOSE_THRESHOLD', 'Right Eye Close'],
        ['LEFT_EYE_CLOSE_THRESHOLD', 'Left Eye Close'],
        ['RIGHT_EYE_OPEN_THRESHOLD', 'Right Eye Open'],
        ['LEFT_EYE_OPEN_THRESHOLD', 'Left Eye Open'],
        ['RIGHT_EYE_SQUINT_RATIO', 'Right Eye Squint'],
        ['LEFT_EYE_SQUINT_RATIO', 'Left Eye Squint'],
        ['BODY_STABLIZE_RATIO', 'Body Stablize Ratio'],
        ['EYE_STABLIZE_RATIO', 'Eye Stablize Ratio'],
        ['MOUTH_STABLIZE_RATIO', 'Mouth Stablize Ratio'],
        ['CAMERA_FLIP', 'Camera Flip']
    ];
}

function getConstModifier(){
    return [{
        'key': 'BG_COLOR',
        'title': 'Background Color',
        'describe': 'Accept Color Code with "#" or "rgba", "hsla"'
    }, {
        'key': 'MOUTH_RATIO',
        'title': 'Mouth Open Ratio',
        'describe': 'The multiplication parameter for mouth openness. Range(0, 20)',
        'range': [0, 20]
    }, {
        'key': 'CHEST_RATIO',
        'title': 'Chest Rotate Ratio',
        'describe': 'The multiplication parameter to rotate the chest as the head rotation. Range(-1, 1)',
        'range': [-1, 1]
    }, {
        'key': 'EYE_LINK_THRESHOLD',
        'title': 'Eyes Link',
        'describe': 'The threshold that control the coherent of the 2 eyes. When the absolute difference of the 2 eyes openness is smaller then the value, the 2 eyes will move together. Range(0, 1)',
        'range': [0, 1]
    }, {
        'key': 'RIGHT_EYE_CLOSE_THRESHOLD',
        'title': 'Right Eye Close',
        'describe': 'Close the eye when the openness is small than the threshold. Range(0, 1)',
        'range': [0, 1]
    }, {
        'key': 'LEFT_EYE_CLOSE_THRESHOLD',
        'title': 'Left Eye Close',
        'describe': 'Close the eye when the openness is small than the threshold. Range(0, 1)',
        'range': [0, 1]
    }, {
        'key': 'RIGHT_EYE_OPEN_THRESHOLD',
        'title': 'Right Eye Open',
        'describe': 'Fully open the eye when the openness is larger than the threshold. Range(0, 1)',
        'range': [0, 1]
    }, {
        'key': 'LEFT_EYE_OPEN_THRESHOLD',
        'title': 'Left Eye Open',
        'describe': 'Fully open the eye when the openness is larger than the threshold. Range(0, 1)',
        'range': [0, 1]
    }, {
        'key': 'RIGHT_EYE_SQUINT_RATIO',
        'title': 'Right Eye Squint',
        'describe': 'The ratio of half-open eye between fully open and close. Range(0, 1)',
        'range': [0, 1]
    }, {
        'key': 'LEFT_EYE_SQUINT_RATIO',
        'title': 'Left Eye Squint',
        'describe': 'The ratio of half-open eye between fully open and close. Range(0, 1)',
        'range': [0, 1]
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
    }, {
        'key': 'BODY_STABLIZE_RATIO',
        'title': 'Body Stablize Ratio',
        'describe': 'Motion become more stable with larger value, but small guesture become harder to track. Avatar stop moving when the value is 1. Range(0, 0.95)',
        'range': [0, 0.95]
    }, {
        'key': 'EYE_STABLIZE_RATIO',
        'title': 'Eye Stablize Ratio',
        'describe': 'Motion become more stable with larger value, but small guesture become harder to track. Avatar stop moving when the value is 1. Range(0, 0.95)',
        'range': [0, 0.95]
    }, {
        'key': 'MOUTH_STABLIZE_RATIO',
        'title': 'Mouth Stablize Ratio',
        'describe': 'Motion become more stable with larger value, but small guesture become harder to track. Avatar stop moving when the value is 1. Range(0, 0.95)',
        'range': [0, 0.95]
    }, {
        'key': 'CAMERA_FLIP',
        'title': 'Camera Flip',
        'describe': 'Flip the camera horizontally. Accept "true|false" value',
        'valid': [true, false]
    }];
}