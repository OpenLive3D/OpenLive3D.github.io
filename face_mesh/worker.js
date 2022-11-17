self.importScripts("face_mesh.js");

let fModel = null;
let fModelInit = false;
let metakey = 0;
async function init(){
    fModel = new FaceMesh({locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/${file}`;
    }});
    fModel.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.55
    });
    fModel.onResults(function(results){
        let newResult = {};
        if("multiFaceLandmarks" in results && results["multiFaceLandmarks"].length == 1){
            newResult["faceLandmarks"] = results["multiFaceLandmarks"][0];
        }
        try{
            postMessage({
                "metakey": metakey,
                "results": newResult
            });
        }
        catch(err){
            console.log(err);
        }
    });
    console.log("holistic worker initialization!");
    fModelInit = true;
}
init();

onmessage = async e => {
    if(fModelInit && e.data && e.data["metakey"] && e.data["image"]){
        metakey = e.data["metakey"];
        await fModel.send({image: e.data["image"]});
    }
}