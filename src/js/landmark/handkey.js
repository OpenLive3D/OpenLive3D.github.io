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

function hand2Info(hand, leftright){
    let keyInfo = {};
    let prefix = ["left", "right"][leftright];
    let imrp = getIMRPRatio(hand, prefix);
    keyInfo[prefix + "thumb"] = getThumbRatio(hand, prefix);
    keyInfo[prefix + "index"] = imrp[0];
    keyInfo[prefix + "middle"] = imrp[1];
    keyInfo[prefix + "ring"] = imrp[2];
    keyInfo[prefix + "pinky"] = imrp[3];
    return keyInfo;
}

function arm2Info(PoI, leftright){
    let keyInfo = {};
    let patRatio = 0;
    let foldRatio = 0;
    let turnRatio = 0;
    keyInfo["pat"] = patRatio;
    keyInfo["fold"] = foldRatio;
    keyInfo["turn"] = turnRatio;
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