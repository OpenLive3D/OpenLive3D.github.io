const MARKCOLOR = {
    "head" : "#f00", // red
    "righteye" : "#7ff", // cyan
    "lefteye" : "#7ff", // cyan
    "mouth" : "#ff7", // yellow
    "rightbrow": "#f7f", // purple
    "leftbrow": "#f7f", // purple
    
    "elbow": "#ccc", // light-gray
    "shoulder": "#fff", // white

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

function average3d(p1, p2){
    return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2];
}

function distance3d(p1, p2){
    const horiz = p2[0] - p1[0];
    const vert = p2[1] - p1[1];
    const depth = p2[2] - p1[2];
    return Math.sqrt((horiz * horiz) + (vert * vert) + (depth * depth));
}

function distance2d(p1, p2){
    const horiz = p2[0] - p1[0];
    const vert = p2[1] - p1[1];
    return Math.sqrt((horiz * horiz) + (vert * vert));
}

function slope(xIdx, yIdx, p1, p2){
  return (p2[yIdx]-p1[yIdx]) / (p2[xIdx]-p1[xIdx]);
}

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

function mergePoints(PoI, tPoI){
    Object.keys(tPoI).forEach(function(key){
        PoI[key] = tPoI[key];
    });
}
