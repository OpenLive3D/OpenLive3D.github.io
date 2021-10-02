let lmModel = null; // landmark model placeholder

function loadLandmarkModel(cb){
    // load the MediaPipe facemesh model assets.
    faceLandmarksDetection.load().then(function(_model){
        console.log("landmark initialized");
        lmModel = _model;
        cb();
    });
}

function getDefaultInfo(){
    return [{}, {
        "roll": 0, "pitch": 0, "yaw": 0,
        "lefteyeopen": 0, "righteyeopen": 0,
        "mouth": 0
    }];
}

function getFaceInfo(image, cmf, cpi, cb){
    if(lmModel && image.readyState === 4){
        lmModel.pipeline.maxFaces = cmf;
        lmModel.estimateFaces({
            input: image,
            returnTensors: false,
            flipHorizontal: false,
            predictIrises: cpi
        }).then(function(_faces){
            // update the global myFaces
            if(_faces.length > 0){
                var keyPoints = packFace(_faces[0]);
                var faceInfo = face2Info(keyPoints);
                cb([keyPoints, faceInfo]);
            }
        });
    }
}
