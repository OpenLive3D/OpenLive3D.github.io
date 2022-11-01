let ttttt = new Date().getTime();
self.importScripts("holistic.js");

let hModel = null;
let hModelInit = false;
async function init(){
    hModel = new Holistic({locateFile: (file) => {
        if(file.endsWith(".tflite")){
            return file;
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
    hModel.onResults(function(results){
        try{
            postMessage(results);
        }
        catch(err){
            console.log(err);
        }
    });
    console.log("holistic worker initialization!");
    hModelInit = true;
}
init();

onmessage = async e => {
    if(hModelInit && e.data){
        await hModel.send({image: e.data});
    }
}