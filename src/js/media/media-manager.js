let capture = document.createElement("video");
capture.playsinline = "playsinline";
capture.autoplay = "autoplay";

const defaultWidth = 640, defaultHeight = 480;
const scaleWidth = {min: defaultWidth};
const scaleHeight = {min: defaultHeight};
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
            width: scaleWidth,
            height: scaleHeight,
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
let resetting = false;
function setVideoStream(deviceId, cb){
    // stop current video
    resetting = true;
    capture.srcObject.getTracks().forEach(track => {
        track.stop();
    });
    window.stream.getTracks().forEach(track => {
        track.stop();
    });
    navigator.mediaDevices.getUserMedia({
        audio: false, video: {
            deviceId: deviceId ? {exact: deviceId} : undefined,
            width: scaleWidth,
            height: scaleHeight,
        }
    }).then(function(stream){
        console.log("video stream set: ", deviceId);
        window.stream = stream;
        capture.srcObject = stream;
    });
    capture.onloadeddata = cb;
}

function reSettingDone(){
    resetting = false;
}

// set canvas context size with the camera
function linkCamera2Context(canvas, cr){
    capture.width = capture.videoWidth;
    capture.height = capture.videoHeight;
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
    if((capture.readyState === 4) && (!resetting)){
        return true;
    }else{
        return false;
    }
}

let capImage = document.createElement("canvas");
let capCtx = capImage.getContext('2d', {willReadFrequently: true});
capImage.width  = defaultWidth;
capImage.height = defaultHeight;
function getCaptureImage(){
    capCtx.drawImage(capture, 0, 0);
    return capCtx.getImageData(0, 0, defaultWidth, defaultHeight);
}
