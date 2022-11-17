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

function getDefaultInfo(){
    return {
        "roll": 0, "pitch": 0, "yaw": 0,
        "leftEyeOpen": 0, "rightEyeOpen": 0,
        "irisPos": 0,
        "mouth": 0,
        "brows": 0,
        "x": 0, "y": 0, "z": 0, // -1 < x,y,z < 1
        "auto": 0,
        "tilt": 0,
        "lean": 0,
        "leftWristX": 0, "rightWristX": 0, // -1 < x < 1
        "leftWristY": 0, "rightWristY": 0, //  0 < y < 1
        "leftThumb": 0, "rightThumb": 0,
        "leftIndex": 0, "rightIndex": 0,
        "leftMiddle": 0, "rightMiddle": 0,
        "leftRing": 0, "rightRing": 0,
        "leftLittle": 0, "rightLittle": 0,
        "leftRoll": 0, "rightRoll": 0,
        "leftPitch": 0, "rightPitch": 0,
        "leftYaw": 0, "rightYaw": 0,
        "leftSpread": 0, "rightSpread": 0,
    };
}

function reverse3d(p1, p2){
    return [-(p2[1] - p1[1]), p2[0] - p1[0], -(p2[2] - p1[2])];
}

function sum3d(p1, p2){
    return [p1[0] + p2[0], p1[1] + p2[1], p1[2] + p2[2]];
}

function average3d(p1, p2){
    return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2];
}

function weight3d(p1, p2, w1, w2){
    let w12 = w1 + w2;
    return [(p1[0] * w1 + p2[0] * w2) / w12,
        (p1[1] * w1 + p2[1] * w2) / w12,
        (p1[2] * w1 + p2[2] * w2) / w12];
}

function distance3d(p1, p2 = [0, 0, 0]){
    const horiz = p2[0] - p1[0];
    const vert = p2[1] - p1[1];
    const depth = p2[2] - p1[2];
    return Math.sqrt((horiz * horiz) + (vert * vert) + (depth * depth));
}

function distance2d(p1, p2 = [0, 0]){
    const horiz = p2[0] - p1[0];
    const vert = p2[1] - p1[1];
    return Math.sqrt((horiz * horiz) + (vert * vert));
}

function slope(xIdx, yIdx, p1, p2){
  return (p2[yIdx] - p1[yIdx]) / (p2[xIdx] - p1[xIdx]);
}

function slopeXY(xIdx, yIdx, p1, p2){
  return [p2[xIdx] - p1[xIdx], p2[yIdx] - p1[yIdx]];
}

function diff3d(p1, p2){
    return [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
}

function cross3d(p1, p2){
    return [
        p1[1] * p2[2] - p1[2] * p2[1],
        p1[2] * p2[0] - p1[0] * p2[2],
        p1[0] * p2[1] - p1[1] * p2[0]
    ];
}

function dot3d(p1, p2){
    return p1[0] * p2[0] + p1[1] * p2[1] + p1[2] * p2[2];
}

function normalize3d(p1){
    let d = distance3d(p1);
    return [p1[0] / d, p1[1] / d, p1[2] / d];
}

// holistic worker
let hworker = null;
let fworker = null;
function loadMLModels(onResults, cb){
    hworker = new Worker("holistic/worker.js");
    fworker = new Worker("face_mesh/worker.js");
    hworker.onmessage = onResults;
    fworker.onmessage = onResults;
    cb();
}

function getMLModel(handtrack){
    if(handtrack){
        return hworker;
    }else{
        return fworker;
    }
}

function checkMLModel(){
    if(hworker && fworker){
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
