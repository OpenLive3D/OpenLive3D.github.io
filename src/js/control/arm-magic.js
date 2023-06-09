// arm magic
// interpret arm moving from ML model to VRM

// Left most
// [0, 0, 45], [40, 0, 23], [40, 0, 0], [35, -15, -23], [30, -30, -45]
// [20, 0, 0], [30, 0, 0], [40, 0, 0], [45, 0, 0], [50, 0, 0]
// Left / 2
// [0, 0, 57], [20, 3, 44], [20, 5, 30], [20, -25, 20], [15, -50, -45]
// [0, -15, 5], [10, -50, 10], [20, -70, 5], [20, -70, -20], [25, -10, 0]
// middle
// [0, 0, 70], [0, 5, 65], [0, 10, 60], [0, -30, -5], [0, -70, -70]
// [-20, -30, 10], [-10, -85, 5], [0, -140, 0], [0, -80, -40], [0, -10, 0]
// right / 2
// [45, 0, 90], [45, 0, 70], [70, 0, 70], [80, -20, 70], [80, -75, 20]
// [-40, 0, 40], [-30, -60, 60], [-30, -100, 45], [-20, -90, 10], [-10, -50, 0]
// right most
// [45, 0, 110], [60, 0, 110], [90, 0, 110], [115, 0, 110], [135, 0, 110]
// [-45, -20, 30], [-45, -30, 40], [-45, -45, 45], [-45, -45, 20], [-45, -45, 0]

let armScales = {
    "UpperArm": [
        [[0, 0, 45], [40, 0, 25], [40, 0, 0], [35, -15, -23], [30, -30, -45]],
        [[0, 0, 57], [20, 3, 44], [20, 5, 30], [20, -25, 20], [15, -50, -45]],
        [[0, 0, 70], [0, 5, 65], [0, 10, 60], [0, -30, -5], [0, -70, -70]],
        [[45, 0, 90], [45, 0, 70], [70, 0, 70], [80, -20, 70], [80, -75, 20]],
        [[45, 0, 110], [60, 0, 110], [90, 0, 110], [115, 0, 110], [135, 0, 110]]
    ],
    "LowerArm": [
        [[20, 0, 0], [30, 0, 0], [40, 0, 0], [45, 0, 0], [50, 0, 0]],
        [[0, -15, 5], [10, -50, 10], [20, -70, 5], [20, -70, -20], [25, -10, 0]],
        [[-20, -30, 10], [-10, -85, 5], [0, -140, 0], [0, -80, -40], [0, -10, 0]],
        [[-40, 0, 40], [-30, -60, 60], [-30, -100, 45], [-20, -90, 10], [-10, -50, 0]],
        [[-45, -20, 30], [-45, -30, 40], [-45, -45, 45], [-45, -45, 20], [-45, -45, 0]]
    ],
    // "Hand": [
    //     [[-100, -50, -160], [-90, -60, -110], [-90, -90, -90], [-30, -60, -30], [-20, -40, 0]],
    //     [[-100, -30, -170], [-60, -50, -100], [-30, -50, -60], [-10, -20, -30], [0, -15, -20]],
    //     [[-50, 10, -150], [-60, 0, -100], [-60, 20, -40], [0, 10, -30], [20, 5, -20]],
    //     [[-50, 20, -150], [-30, 40, -130], [-50, 80, -50], [-40, 40, -40], [0, 40, -25]],
    //     [[-30, 50, -150], [-30, 50, -140], [-10, 70, -100], [-40, 60, -50], [-45, 45, -10]]
    // ]
};

Object.keys(armScales).forEach(function(armkey){
    let scales = armScales[armkey];
    for(scale of scales){
        for(let j = 0; j < 5; j ++){
            for(let i = 0; i < 3; i ++){
                scale[j][i] *= Math.PI / 180;
            }
        }
    }
});

function armMagic(x, y, z, leftright){
    let prefix = ["left", "right"][leftright];
    let lrRatio = 1 - leftright * 2;
    let armRotate = {};
    Object.keys(armScales).forEach(function(armkey){
        let scales = armScales[armkey];
        let tx = Math.max(0, Math.min(4, (x + lrRatio * 0.2 + 1) * 2));
        let ty = Math.max(0, Math.min(4, (y + 0.06) * 4));
        if(leftright){
            tx = 4 - tx;
        }
        let xi = Math.min(3, Math.floor(tx));
        let yi = Math.min(3, Math.floor(ty));
        let xyz1 = weight3d(scales[xi][yi], scales[xi][yi + 1], yi + 1 - ty, ty - yi);
        let xyz2 = weight3d(scales[xi + 1][yi], scales[xi + 1][yi + 1], yi + 1 - ty, ty - yi);
        let xyz = weight3d(xyz1, xyz2, xi + 1 - tx, tx - xi);
        armRotate[armkey] = [xyz[0], lrRatio * xyz[1], lrRatio * xyz[2]];
    });
    return armRotate;
}

let armTuneRatios = {
    "UpperArm": 0.1,
    "LowerArm": 0.6,
}
function armMagicEuler(wx, wy, hy, hr, hp, leftright){
    let VRM_R = [getCMV('VRM_XR'), getCMV('VRM_YR'), getCMV('VRM_ZR')];
    let lrRatio = 1 - leftright * 2;
    let nq = new THREE.Quaternion();
    let armRotate = armMagic(wx, wy, 0, leftright);
    let armEuler = {};
    Object.keys(armRotate).forEach(function(armkey){
        let rt = armRotate[armkey];
        let ae = new THREE.Euler(rt[0] * VRM_R[0], rt[1] * VRM_R[1], rt[2] * VRM_R[2]);
        let aq = new THREE.Quaternion().setFromEuler(ae);
        let armTR = armTuneRatios[armkey];
        let ee = new THREE.Euler(-hy*lrRatio * armTR * VRM_R[0], 0, 0);
        let eq = new THREE.Quaternion().setFromEuler(ee);
        aq.multiply(eq);
        ae = new THREE.Euler().setFromQuaternion(aq);
        nq.multiply(aq);
        armEuler[armkey] = ae;
    });
    nq.invert();
    let de = new THREE.Euler(0, -Math.PI/2*lrRatio * VRM_R[1], -Math.PI/2*lrRatio * VRM_R[2]);
    nq.multiply(new THREE.Quaternion().setFromEuler(de));
    let he = new THREE.Euler(-hy*lrRatio * VRM_R[0], hr * VRM_R[1], -hp*lrRatio * VRM_R[2]);
    nq.multiply(new THREE.Quaternion().setFromEuler(he));
    let ne = new THREE.Euler().setFromQuaternion(nq);
    armEuler["Hand"] = ne;
    return armEuler;
}
