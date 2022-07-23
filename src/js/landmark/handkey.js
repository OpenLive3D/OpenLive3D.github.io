// Hand Point of Interests
// left right

const HAND_CONNECTIONS = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[0,17],[17,18],[18,19],[19,20]];
const HPoI = {
    "paw": [0, 5, 17],
    "thumb": [2, 4],
    "index": [6, 8],
    "middle": [10, 12],
    "ring": [14, 16],
    "pinky": [18, 20]
};

function hand2Info(pose){
    return {};
}

function packHandHolistic(_hand){
    let wh = getCameraWH();
    function pointUnpack(p){
        return [p.x * wh[0], p.y * wh[1], p.z * wh[1]];
    }
    let ret = {};
    Object.keys(HPoI).forEach(function(key){
        ret[key] = [];
        for(let i = 0; i < HPoI[key].length; i++){
            ret[key][i] = pointUnpack(_hand[HPoI[key][i]]);
        }
    });
    return ret;
}