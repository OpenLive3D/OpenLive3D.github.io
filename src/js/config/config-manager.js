let configManager = {};

function getCM(){
    if(Object.keys(configManager).length === 0){
        initCM();
    }
    return configManager;
}

function initCM(){
    configManager['TIME'] = new Date();
    configManager['MODEL'] = 'https://pixiv.github.io/three-vrm/packages/three-vrm/examples/models/three-vrm-girl.vrm';
    configManager['SCENE_FLIP'] = false;
    configManager['BG_COLOR'] = 0x0000FF;
    configManager['MAX_FACES'] = 1;
    configManager['CANVAS_RATIO'] = 0.2;
    configManager['CAMERA_FLIP'] = true;
    configManager['PREDICT_IRISES'] = true;
    configManager['NUM_KEYPOINTS'] = 468;
    configManager['NUM_IRIS_KEYPOINTS'] = 5;
    configManager['CHEST_RATIO'] = 0.3;
    configManager['MOUTH_RATIO'] = 3;
    configManager['MOUTH_OFFSET'] = -0.02;
    configManager['EYE_LINK_THRESHOLD'] = 0.08;
    configManager['RIGHT_EYE_SQUINT_RATIO'] = 0.4;
    configManager['LEFT_EYE_SQUINT_RATIO'] = 0.4;
    configManager['RIGHT_EYE_CLOSE_THRESHOLD'] = 0.27;
    configManager['LEFT_EYE_CLOSE_THRESHOLD'] = 0.27;
    configManager['RIGHT_EYE_OPEN_THRESHOLD'] = 0.32;
    configManager['LEFT_EYE_OPEN_THRESHOLD'] = 0.32;
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
        ['RIGHT_EYE_CLOSE_THRESHOLD', 'righteyeopen'],
        ['LEFT_EYE_CLOSE_THRESHOLD', 'lefteyeopen']
    ];
}