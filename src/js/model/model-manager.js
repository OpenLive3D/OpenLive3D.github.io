let loader = new THREE.GLTFLoader();

function loadVRMModel(url, cb) {
    loader.crossOrigin = 'anonymous';
    loader.load(url,
        (gltf) => {
            THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene);
            THREE.VRM.from(gltf).then((vrm) => {
                vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.Hips).rotation.y = Math.PI;
                cb(vrm);
            });
        },
        (progress) => console.log('Loading model...', 100.0 * (progress.loaded / progress.total), '%'),
        (error) => console.error(error)
    );
}