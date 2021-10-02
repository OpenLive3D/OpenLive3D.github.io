let capture = document.createElement("video");
capture.playsinline = "playsinline";
capture.autoplay = "autoplay";

// read video from webcam
function startCamera(cb){
    navigator.mediaDevices.getUserMedia({
        audio:false, video:{
            facingMode: 'user',
            width: undefined,
            height: undefined,
        }
    }).then(function(stream){
        console.log("video initialized");
        window.stream = stream;
        capture.srcObject = stream;
    });
    // signal when capture is ready
    capture.onloadeddata = cb;
    return capture;
}

// set canvas context size with the camera
function linkCamera2Context(canvas, cr){
    canvas.width = Math.floor(
        capture.videoWidth * cr);
    canvas.height = Math.floor(
        capture.videoHeight * cr);
}

// return the capture as frame
function getCameraFrame(){
    return capture;
}
