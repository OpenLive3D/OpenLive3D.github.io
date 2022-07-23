const MARKCOLOR = {
    "head" : "#f00", // red
    "righteye" : "#7ff", // cyan
    "lefteye" : "#7ff", // cyan
    "mouth" : "#ff7", // yellow
    "rightbrow": "#f7f", // purple
    "leftbrow": "#f7f", // purple
    "elbow": "#ccc", // light-gray
    "shoulder": "#fff", // white
    "paw": "#0f0", // green
    "thumb": "#070", // dark-green
    "index": "#070", // dark-green
    "middle": "#070", // dark-green
    "ring": "#070", // dark-green
    "pinky": "#070" // dark-green
};

let hModel = null;
function loadHolistic(onResults, cb){
    hModel = new Holistic({locateFile: (file) => {
        if(file.endsWith(".data") || file.endsWith(".tflite")){
            return `https://wei-1.github.io/holistic-website-test/data/${file}`;
        }else{
            return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5/${file}`;
        }
    }});
    hModel.setOptions({
        cameraOn: true,
        modelComplexity: 0,
        useCpuInference: false,
        smoothLandmarks: false,
        enableSegmentation: false,
        smoothSegmentation: false,
        refineFaceLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.55,
    });
    hModel.onResults(onResults);
    cb();
}

function getHolisticModel(){
    return hModel;
}

function checkHModel(){
    if(hModel){
        return true;
    }else{
        return false;
    }
}
