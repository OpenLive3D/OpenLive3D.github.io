// Face Point of Interests
// left right top down center
// https://i.stack.imgur.com/5Mohl.jpg

const FPoI = {
    "head": [127, 356, 10, 152, 168],
    "righteye": [33, 133, 159, 145, 468],
    "lefteye": [362, 263, 386, 374, 473],
    "mouth": [78, 308, 13, 14],
    "rightbrow": [105, 107],
    "leftbrow": [336, 334]
};

function getOpenRatio(obj){
    const width = distance3d(obj[0], obj[1]);
    const height = distance3d(obj[2], obj[3]);
    return height / width;
}

function getPosRatio(obj){
    const dleft = distance3d(obj[0], obj[4]);
    const dright = distance3d(obj[1], obj[4]);
    return dleft / (dleft + dright);
}

function getHeadRotation(head){
    const rollSlope = slope(0, 1, head[1], head[0]);
    const roll = Math.atan(rollSlope);
    const yawSlope = slope(0, 2, head[1], head[0]);
    const yaw = Math.atan(yawSlope);
    const pitchSlope = slope(2, 1, head[2], head[3]);
    let pitch = Math.atan(pitchSlope);
    if(pitch > 0){
        pitch -= Math.PI;
    }
    return [roll, pitch + Math.PI / 2, yaw];
}

function getHeadXYZ(head){
    let wh = getCameraWH();
    let topx = head[2][0];
    let topy = head[2][1];
    let downx = head[3][0];
    let downy = head[3][1];
    let x = Math.max(-1, Math.min(1, (topx + downx) / wh[0] - 1));
    let y = Math.max(-1, Math.min(1, (topy + downy) / wh[0] - 1));
    let z = Math.max(-1, Math.min(1, wh[1] / distance3d(head[2], head[3]) - 3));
    return [x, y, z];
}

function getMoodAutoDraft(mouth){
    let mbalance = average3d(mouth[0], mouth[1]);
    let mmove = average3d(mouth[2], mouth[3]);
    let absauto = Math.min(1, distance2d(mbalance, mmove) / distance3d(mouth[0], mouth[1]));
    if(mbalance[1] > mmove[1]){ // compare Y
        return -absauto;
    }else{
        return absauto;
    }
}

function getMoodAuto(autoDraft, headRotate){
    let absYaw = Math.abs(headRotate[2]);
    if(autoDraft > 0){
        return Math.max(0, autoDraft - absYaw / 1.5);
    }else{
        return Math.min(0, autoDraft + absYaw / 1.5);
    }
}

function getBrowsRatio(face){
    let htop = face["head"][2];
    let hmid = face["head"][4];
    let letop = face["lefteye"][2];
    let retop = face["righteye"][2];
    let d1 = distance3d(face["rightbrow"][0], htop) +
        distance3d(face["rightbrow"][1], htop) +
        distance3d(face["leftbrow"][0], htop) +
        distance3d(face["leftbrow"][1], htop);
    let d2 = distance3d(face["rightbrow"][0], hmid) +
        distance3d(face["rightbrow"][1], hmid) +
        distance3d(face["leftbrow"][0], hmid) +
        distance3d(face["leftbrow"][1], hmid);
    return d2 / (d1 + d2);
}

function getDefaultFaceInfo(){
    return {
        "roll": 0, "pitch": 0, "yaw": 0,
        "lefteyeopen": 0, "righteyeopen": 0,
        "irispos": 0,
        "mouth": 0,
        "brows": 0,
        "x": 0, "y": 0, "z": 0, // -1 < x,y,z < 1
        "auto": 0
    };
}

function getKeyType(key){
    if(["roll", "pitch", "yaw"].includes(key)){
        return "body";
    }else if(["lefteyeopen", "righteyeopen", "irispos"].includes(key)){
        return "eye";
    }else if(["mouth"].includes(key)){
        return "mouth";
    }else{
        return "body";
    }
}

function face2Info(face){
    let keyInfo = {};
    let headRotate = getHeadRotation(face["head"]);
    let headXYZ = getHeadXYZ(face["head"]);
    let autoDraft = getMoodAutoDraft(face["mouth"]);
    keyInfo["roll"] = headRotate[0];
    keyInfo["pitch"] = headRotate[1];
    keyInfo["yaw"] = headRotate[2];
    keyInfo["lefteyeopen"] = getOpenRatio(face["lefteye"]);
    keyInfo["righteyeopen"] = getOpenRatio(face["righteye"]);
    keyInfo["irispos"] = getPosRatio(face["lefteye"]) + getPosRatio(face["righteye"]) - 1;
    keyInfo["mouth"] = Math.max(0, getOpenRatio(face["mouth"]) - Math.abs(headRotate[1] / 10));
    keyInfo["brows"] = getBrowsRatio(face);
    keyInfo["x"] = headXYZ[0];
    keyInfo["y"] = headXYZ[1];
    keyInfo["z"] = headXYZ[2];
    keyInfo["auto"] = getMoodAuto(autoDraft, headRotate);
    return keyInfo;
}

// reduce vertices to the desired set, and compress data as well
function packFaceHolistic(_face){
    let wh = getCameraWH();
    function pointUnpack(p){
        return [p.x * wh[0], p.y * wh[1], p.z * wh[1]];
    }
    let ret = {};
    Object.keys(FPoI).forEach(function(key){
        ret[key] = [];
        for(let i = 0; i < FPoI[key].length; i++){
            ret[key][i] = pointUnpack(_face[FPoI[key][i]]);
        }
    });
    return ret;
}
