let capture = document.createElement("video");
capture.playsinline = "playsinline";
capture.autoplay = "autoplay";

const defaultWidth = 640, defaultHeight = 480;
capture.width = defaultWidth;
capture.height = defaultHeight;

// list cameras
function listCameras(cb){
    let carr = [];
    let count = 1;
    navigator.mediaDevices.enumerateDevices().then(darr => {
        darr.forEach(mediaDevice => {
            if(mediaDevice.kind === 'videoinput'){
                let id = mediaDevice.deviceId;
                let name = mediaDevice.label || `Camera ${count++}`;
                carr.push({"id": id, "name": name});
            }
        })
        cb(carr);
    });
}

// get current video device id
function getCurrentVideoId(){
    return capture.srcObject.getTracks()[0].getSettings()['deviceId'];
}

// read video from webcam
function startCamera(cb){
    navigator.mediaDevices.getUserMedia({
        audio: false, video: {
            facingMode: 'user',
            width: defaultWidth,
            height: defaultHeight,
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

// change current video to a new source
function setVideoStream(deviceId){
    // stop current video
    capture.srcObject.getTracks().forEach(track => {
        track.stop();
    });
    navigator.mediaDevices.getUserMedia({
        audio: false, video: {
            deviceId: deviceId,
            width: defaultWidth,
            height: defaultHeight,
        }
    }).then(function(stream){
        console.log("video initialized");
        window.stream = stream;
        capture.srcObject = stream;
    });
}

// set canvas context size with the camera
function linkCamera2Context(canvas, cr){
    canvas.width = Math.floor(
        capture.videoWidth * cr);
    canvas.height = Math.floor(
        capture.videoHeight * cr);
}

// video width and height
function getCameraWH(){
    return [capture.videoWidth, capture.videoHeight];
}

// return the capture as frame
function getCameraFrame(){
    return capture;
}

// validate image readiness
function checkImage(){
    if(capture.readyState === 4){
        return true;
    }else{
        return false;
    }
}