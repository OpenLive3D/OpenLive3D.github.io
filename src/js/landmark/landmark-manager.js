let lmModel = null; // landmark model placeholder

function loadLandmarkModel(cb){
    // load the MediaPipe facemesh model assets.
    faceLandmarksDetection.load().then(function(_model){
        console.log("landmark initialized");
        lmModel = _model;
        cb();
    });
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
                let keyPoints = packFace(_faces[0]);
                let faceInfo = face2Info(keyPoints);
                cb(keyPoints, faceInfo);
            }else{
                cb(null, null);
            }
        });
    }
}
