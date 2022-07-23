// Post Point of Interests
// left right
// https://google.github.io/mediapipe/solutions/pose.html

const PPoI = {
    "elbow": [13, 14],
    "shoulder": [11, 12]
};

function getElbowUpFront(pose, leftright){
    let shoulder = pose["shoulder"][leftright];
    let elbow = pose["elbow"][leftright];
    let d = distance3d(shoulder, elbow);
    let up = (shoulder[1] - elbow[1]) / d;
    let front = (shoulder[2] - elbow[2]) / d;
    return [up, front];
}

function getTiltLean(shoulder){
    let d = distance3d(shoulder[0], shoulder[1]);
    let tilt = (shoulder[0][1] - shoulder[1][1]) / d;
    let lean = (shoulder[0][2] - shoulder[1][2]) / d;
    return [tilt, lean];
}

function pose2Info(pose){
    let keyInfo = {};
    let tl = getTiltLean(pose["shoulder"]);
    let lelbow = getElbowUpFront(pose, 0);
    let relbow = getElbowUpFront(pose, 1);
    keyInfo["tilt"] = tl[0];
    keyInfo["lean"] = tl[1];
    keyInfo["leftelbow-up"] = lelbow[0];
    keyInfo["leftelbow-front"] = lelbow[1];
    keyInfo["rightelbow-up"] = relbow[0];
    keyInfo["rightelbow-front"] = relbow[1];
    return keyInfo;
}

function packPoseHolistic(_pose){
    let wh = getCameraWH();
    function pointUnpack(p){
        return [p.x * wh[0], p.y * wh[1], p.z * wh[1]];
    }
    let ret = {};
    Object.keys(PPoI).forEach(function(key){
        ret[key] = [];
        for(let i = 0; i < PPoI[key].length; i++){
            ret[key][i] = pointUnpack(_pose[PPoI[key][i]]);
        }
    });
    return ret;
}