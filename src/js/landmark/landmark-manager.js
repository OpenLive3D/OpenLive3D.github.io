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

function checkLMModel(){
    if(lmModel){
        return true;
    }else{
        return false;
    }
}

let hModel = null;
function loadHolistic(onResults, cb){
    hModel = new Holistic({locateFile: (file) => {
        if(file.endsWith(".data") || file.endsWith(".tflite")){
            return `https://wei-1.github.io/holistic-website-test/data/${file}`;
        }else{
            return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5/${file}`;
        }
    }});
    hModel.setOptions({
        cameraOn: true,
        modelComplexity: 0,
        useCpuInference: false,
        smoothLandmarks: false,
        enableSegmentation: false,
        smoothSegmentation: false,
        refineFaceLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.55,
    });
    hModel.onResults(onResults);
    cb();
}

function getHolisticModel(){
    return hModel;
}

function checkHModel(){
    if(hModel){
        return true;
    }else{
        return false;
    }
}
