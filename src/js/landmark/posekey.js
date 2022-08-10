// Post Point of Interests
// left right
// https://google.github.io/mediapipe/solutions/pose.html

const PPoI = {
    "elbow": [13, 14],
    "shoulder": [11, 12],
    "wrist": [15, 16],
};

function getElbowUpFront(pose, leftright){
    let shoulder = pose["shoulder"][leftright];
    let elbow = pose["elbow"][leftright];
    let d = distance3d(shoulder, elbow);
    let up = (shoulder[1] - elbow[1]) / d;
    let front = (shoulder[2] - elbow[2]) / d;
    return [up, front];
}

// Down   //    0   0  70 //  -20 -30  10
// Down/2 //    0   5  65 //  -10 -85   5
// Middle //    0  10  60 //    0 -140  0
// Up/2   //    0 -30  -5 //    0 -80 -40
// Up     //    0 -70 -70 //    0 -10   0
function getWristXYZ(pose, leftright){
    let base = distance3d(pose["shoulder"][0], pose["shoulder"][1]) * 1.2;
    let shoulder = pose["shoulder"][leftright];
    let wrist = pose["wrist"][leftright];
    let x = Math.max(-1, Math.min(1, (shoulder[0] - wrist[0]) / base));
    let y = Math.max( 0, Math.min(1, (shoulder[1] - wrist[1]) / base / 2 + 0.5));
    let z = +(wrist[2] > shoulder[2]);
    return [x, y, z];
}

function getTiltLean(shoulder){
    let d = distance3d(shoulder[0], shoulder[1]);
    let tilt = (shoulder[0][1] - shoulder[1][1]) / d;
    let lean = (shoulder[0][2] - shoulder[1][2]) / d;
    return [tilt, lean * Math.sqrt(Math.abs(lean))];
}

function pose2Info(pose){
    let keyInfo = {};
    let tl = getTiltLean(pose["shoulder"]);
    let lwrist = getWristXYZ(pose, 0);
    let rwrist = getWristXYZ(pose, 1);
    keyInfo["tilt"] = tl[0];
    keyInfo["lean"] = tl[1];
    keyInfo["leftWristX"] = lwrist[0];
    keyInfo["leftWristY"] = lwrist[1];
    keyInfo["rightWristX"] = rwrist[0];
    keyInfo["rightWristY"] = rwrist[1];
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