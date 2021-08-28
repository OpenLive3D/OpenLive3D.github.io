// initialize the control
function initialize(){

    // html canvas for drawing debug view
    createLayout();

    // start video
    startCamera(function(){
        linkCamera2Context(document.getElementById('dbg'));
        console.log("video connected");
    });

    // load ml libraries
    loadLandmarkModel(function(){
        console.log("landmark model connected");
    });

    console.log("controller initialized");
}

// the main render loop
function loop(){

    var image = getCameraFrame();
    var info = [];

    getFaceInfo(image, function(_info){
        info = _info;
        if(info.length == 2){
            drawImage('dbg', image);
            drawLandmark('dbg', info[0]);
            printInfo('logbox', info[1]);
        }
    });

    requestAnimationFrame(loop);
}

