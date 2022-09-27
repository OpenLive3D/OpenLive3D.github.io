const TVRMSHBN = THREE_VRM.VRMHumanBoneName;

let loader = new THREE.GLTFLoader();
let defaultPose = [
    [TVRMSHBN.LeftUpperArm, [0, 0, 70]],
    [TVRMSHBN.RightUpperArm, [0, 0, -70]],
    [TVRMSHBN.LeftLowerArm, [-20, -30, 10]],
    [TVRMSHBN.RightLowerArm, [-20, 30, -10]],
    [TVRMSHBN.LeftHand, [0, 0, 0]],
    [TVRMSHBN.RightHand, [0, 0, 0]]
];

function setDefaultPose(vrm){
    for(let i = 0; i < defaultPose.length; i ++){
        let pose = defaultPose[i];
        for(let j = 0; j < 3; j ++){
            vrm.humanoid.getRawBoneNode(pose[0]).rotation["xyz"[j]] = pose[1][j] / 180 * Math.PI;
        }
    }
}

function setDefaultHand(vrm, leftright){
    for(let i = leftright; i < defaultPose.length; i += 2){
        let pose = defaultPose[i];
        for(let j = 0; j < 3; j ++){
            vrm.humanoid.getRawBoneNode(pose[0]).rotation["xyz"[j]] = pose[1][j] / 180 * Math.PI;
        }
    }
}

function loadVRMModel(url, cb) {
    loader.crossOrigin = 'anonymous';
    loader.register((parser) => {
        return new THREE_VRM.VRMLoaderPlugin(parser);
    });
    loader.load(url,
        (gltf) => {
            THREE_VRM.VRMUtils.removeUnnecessaryVertices(gltf.scene);
            THREE_VRM.VRMUtils.removeUnnecessaryJoints(gltf.scene);
            let vrm = gltf.userData.vrm;
            // setDefaultPose(vrm);
            cb(vrm);
        },
        (progress) => console.log('Loading model...', 100.0 * (progress.loaded / progress.total), '%'),
        (error) => console.error(error)
    );
}