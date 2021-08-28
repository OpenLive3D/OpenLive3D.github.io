function createLayout(){

    // html canvas for drawing debug view
    var dbg = document.createElement("canvas").getContext('2d');
    dbg.canvas.id = "dbg";
    dbg.canvas.style.position = "absolute";
    dbg.canvas.style.left = "0px";
    dbg.canvas.style.top = "0px";
    dbg.canvas.style.zIndex = 1; // "bring to back"
    document.body.appendChild(dbg.canvas);

    // text div for debug log
    var logbox = document.createElement('div');
    logbox.id = "logbox";
    logbox.style.position = "absolute";
    logbox.style.left = "5px";
    logbox.style.top = "0px";
    logbox.style.zIndex = 2; // "bring to front"
    document.body.appendChild(logbox);

    console.log("gui layout initialized");
}

function drawImage(target, image){

    // get debug camera canvas
    var dbg = document.getElementById(target).getContext('2d');
    dbg.clearRect(0, 0, dbg.canvas.width, dbg.canvas.height);
    dbg.save();
    if (CAMERA_FLIP){
        dbg.translate(dbg.canvas.width, 0);
        dbg.scale(- CANVAS_RATIO, CANVAS_RATIO);
    }else{
        dbg.scale(CANVAS_RATIO, CANVAS_RATIO);
    }
    dbg.drawImage(image, 0, 0); // print the camera
    dbg.restore();
}

function drawLandmark(target, landmark){

    // get debug camera canvas
    var dbg = document.getElementById(target).getContext('2d');
    dbg.save();
    if (CAMERA_FLIP){
        dbg.translate(dbg.canvas.width, 0);
        dbg.scale(- CANVAS_RATIO, CANVAS_RATIO);
    }else{
        dbg.scale(CANVAS_RATIO, CANVAS_RATIO);
    }

    Object.keys(landmark).forEach(function (key) {
        for (var i = 0; i < landmark[key].length; i++){
            var p = landmark[key][i];
            dbg.fillStyle = MARKCOLOR[key];
            dbg.beginPath();
            dbg.arc(p[0], p[1], 4, 0, 2 * Math.PI);
            dbg.fill();
        }
    });

    dbg.restore();
}

function printInfo(target, jsonObj){
    var obj = document.getElementById(target);
    obj.innerHTML = '';

    Object.keys(jsonObj).forEach(function (key) {

        var jsonItem = document.createElement('p');
        jsonItem.innerHTML = key + ": " + Math.floor(jsonObj[key] * 1000) / 1000;
        jsonItem.style.color = "red";
        obj.appendChild(jsonItem);

    });
}
