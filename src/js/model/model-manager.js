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
    let VRM_R = [getCMV('VRM_XR'), getCMV('VRM_YR'), getCMV('VRM_ZR')];
    for(let i = 0; i < defaultPose.length; i ++){
        let pose = defaultPose[i];
        for(let j = 0; j < 3; j ++){
            vrm.humanoid.getNormalizedBoneNode(pose[0]).rotation["xyz"[j]] =
                pose[1][j] * Math.PI / 180 * VRM_R[j];
        }
    }
}

function setDefaultHand(vrm, leftright){
    let VRM_R = [getCMV('VRM_XR'), getCMV('VRM_YR'), getCMV('VRM_ZR')];
    for(let i = leftright; i < defaultPose.length; i += 2){
        let pose = defaultPose[i];
        for(let j = 0; j < 3; j ++){
            vrm.humanoid.getNormalizedBoneNode(pose[0]).rotation["xyz"[j]] =
                pose[1][j] * Math.PI / 180 * VRM_R[j];
        }
    }
}

function loadVRMModel(url, cb, ecb) {
    loader.crossOrigin = 'anonymous';
    loader.register((parser) => {
        return new THREE_VRM.VRMLoaderPlugin(parser);
    });
    loader.load(url,
        (gltf) => {
            THREE_VRM.VRMUtils.removeUnnecessaryVertices(gltf.scene);
            THREE_VRM.VRMUtils.removeUnnecessaryJoints(gltf.scene);
            let vrm = gltf.userData.vrm;
            if(vrm.meta.metaVersion === '0'){
                setCMV('VRM_XR', 1);
                setCMV('VRM_ZR', 1);
            }else if(vrm.meta.metaVersion === '1'){
                setCMV('VRM_XR', -1);
                setCMV('VRM_ZR', -1);
            }
            setDefaultPose(vrm);
            cb(vrm);
        },
        (progress) => console.log('Loading model...', 100.0 * (progress.loaded / progress.total), '%'),
        (error) => {
            ecb();
            console.error(error);
        }
    );
}