// Hand Point of Interests
// left right
// https://google.github.io/mediapipe/solutions/hands.html

const HAND_CONNECTIONS = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[0,17],[17,18],[18,19],[19,20]];
const HPoI = {
    "paw": [0, 5, 17],
    "thumb": [1, 2, 4],
    "index": [5, 6, 8],
    "middle": [9, 10, 12],
    "ring": [13, 14, 16],
    "pinky": [17, 18, 20]
};

function getThumbRatio(hand, prefix){
    let base = hand[prefix + "paw"][2];
    let d1 = distance3d(hand[prefix + "paw"][1], base);
    let d2 = distance3d(hand[prefix + "thumb"][2], base);
    return (d2 - d1) / d1;
}

function getIMRPRatio(hand, prefix){
    let arr = ["index", "middle", "ring", "pinky"];
    let res = [];
    let base = hand[prefix + "paw"][0];
    for(let i = 0; i < arr.length; i++){
        let d1 = distance3d(hand[prefix + arr[i]][0], base);
        let d2 = distance3d(hand[prefix + arr[i]][2], base);
        res[i] = (d2 - d1) / d1;
    }
    return res;
}

function getHandRotation(hand, leftright){
    let prefix = ["left", "right"][leftright];
    let lrRatio = 1 - leftright * 2;
    let i0 = prefix + "ring";
    let i1 = prefix + "index";
    let i2 = prefix + "middle";
    let i3 = prefix + "paw";
    let rollSlope = slope(0, 1, hand[i1][0], hand[i0][0]);
    let roll = Math.atan(rollSlope);
    let yawSlope = slope(0, 2, hand[i1][0], hand[i0][0]);
    let yaw = Math.atan(yawSlope);
    if((hand[i1][0][0] > hand[i0][0][0]) != (prefix == "right")){
        roll *= -1;
        yaw -= Math.PI * lrRatio;
    }
    let pitchSlope = slope(2, 1, hand[i2][0], hand[i3][0]);
    let pitch = Math.atan(pitchSlope) + Math.PI / 2;
    if(pitch > Math.PI / 2){
        pitch -= Math.PI;
    }
    if(hand[i2][0][1] > hand[i3][0][1]){
        pitch -= Math.PI;
    }
    return [roll, pitch, yaw];
}

function getDefaultHandInto(leftright){
    let prefix = ["left", "right"][leftright];
    let lrRatio = 1 - leftright * 2;
    let keyInfo = {};
    keyInfo[prefix + "Thumb"] = 1;
    keyInfo[prefix + "Index"] = 1;
    keyInfo[prefix + "Middle"] = 1;
    keyInfo[prefix + "Ring"] = 1;
    keyInfo[prefix + "Little"] = 1;
    keyInfo[prefix + "Roll"] = 0;
    keyInfo[prefix + "Pitch"] = Math.PI;
    keyInfo[prefix + "Yaw"] = 0;
    return keyInfo;
}

function hand2Info(hand, leftright){
    let keyInfo = {};
    let prefix = ["left", "right"][leftright];
    let imrp = getIMRPRatio(hand, prefix);
    let handRotate = getHandRotation(hand, leftright);
    keyInfo[prefix + "Thumb"] = getThumbRatio(hand, prefix);
    keyInfo[prefix + "Index"] = imrp[0];
    keyInfo[prefix + "Middle"] = imrp[1];
    keyInfo[prefix + "Ring"] = imrp[2];
    keyInfo[prefix + "Little"] = imrp[3];
    keyInfo[prefix + "Roll"] = handRotate[0];
    keyInfo[prefix + "Pitch"] = handRotate[1];
    keyInfo[prefix + "Yaw"] = handRotate[2];
    return keyInfo;
}

function arm2Info(PoI, leftright){
    let keyInfo = {};
    let prefix = ["left", "right"][leftright];
    let paw = PoI[prefix + "paw"];
    let elbow = PoI["elbow"][leftright];
    let abvec = diff3d(paw[0], paw[1]);
    let acvec = diff3d(paw[0], paw[2]);
    let norvec = normalize3d(cross3d(abvec, acvec));
    let lowerarmvec = normalize3d(diff3d(elbow, paw[0]));
    let patRatio = Math.acos(dot3d(norvec, lowerarmvec));
    let turnRatio = 0;
    keyInfo[prefix + "Pat"] = patRatio;
    keyInfo[prefix + "Turn"] = turnRatio;
    return keyInfo;
}

function packHandHolistic(_hand, leftright){
    let wh = getCameraWH();
    let prefix = ["left", "right"][leftright];
    function pointUnpack(p){
        return [p.x * wh[0], p.y * wh[1], p.z * wh[1]];
    }
    let ret = {};
    Object.keys(HPoI).forEach(function(key){
        ret[prefix + key] = [];
        for(let i = 0; i < HPoI[key].length; i++){
            ret[prefix + key][i] = pointUnpack(_hand[HPoI[key][i]]);
        }
    });
    return ret;
}
