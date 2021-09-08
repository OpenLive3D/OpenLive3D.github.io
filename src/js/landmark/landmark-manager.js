let lmModel = null; // landmark model placeholder

function loadLandmarkModel(cb){
    // load the MediaPipe facemesh model assets.
    faceLandmarksDetection.load().then(function(_model){
        console.log("landmark initialized");
        lmModel = _model;
        cb();
    });
}

function getFaceInfo(image, cb){
    if(lmModel && image.readyState === 4){
        lmModel.pipeline.maxFaces = MAX_FACES;
        lmModel.estimateFaces({
            input: image,
            returnTensors: false,
            flipHorizontal: false,
            predictIrises: PREDICT_IRISES
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
