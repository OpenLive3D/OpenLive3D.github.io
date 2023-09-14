// health manager

// validate counter
let viFPSQueue = [];
let mlFPSQueue = [];
let viHealthQueue = [];
let mlHealthQueue = [];
let viHealthState = 0;
let mlHealthState = 0;
function prettyNumber(n){
    return Math.floor(n * 1000) / 1000;
}

function checkMLHealthQueue(state){
    let healthCount = 0;
    for(let i = 0; i < getCMV("FPS_WAIT"); i++){
        if(mlHealthQueue[i] == state){
            healthCount += 1;
        }
    }
    if(healthCount == getCMV("FPS_WAIT")){
        if(state == 1 && getCMV("HAND_TRACKING")){
            console.log("ALERT: Ultra Fast");
        }else if(state == 2){
            console.log("ALERT: Hardware Acceleration");
        }else if(state == 3){
            console.log("ALERT: Error");
        }
        mlHealthState = state;
        raiseAlert(viHealthState, mlHealthState);
    }
}
function checkVIHealthQueue(state){
    let healthCount = 0;
    for(let i = 0; i < getCMV("FPS_WAIT"); i++){
        if(viHealthQueue[i] == state){
            healthCount += 1;
        }
    }
    if(healthCount == getCMV("FPS_WAIT")){
        if(state == 1){
            console.log("ALERT: Slow");
        }else if(state == 2){
            console.log("ALERT: Hardware Acceleration");
        }else if(state == 3){
            console.log("ALERT: Full Screen / Wrong Tab");
        }
        viHealthState = state;
        raiseAlert(viHealthState, mlHealthState);
    }
}
function checkHealth(){
    let viFPS = getCMV("VI_LOOP_COUNTER") / getCMV("HEALTH_RATE");
    let mlFPS = getCMV("ML_LOOP_COUNTER") / getCMV("HEALTH_RATE");
    let dynamicMLDura = getCMV("DYNA_ML_DURATION");
    if(isNaN(dynamicMLDura)){
        setCMV("DYNA_ML_DURATION", getCMV("MIN_ML_DURATION"));
    }
    dynamicMLDura *= (mlFPS / getCMV("ML_FPS_LIMIT"));
    dynamicMLDura = Math.max(dynamicMLDura, getCMV("MIN_ML_DURATION"));
    dynamicMLDura = Math.min(dynamicMLDura, getCMV("MAX_ML_DURATION"));
    setCMV("DYNA_ML_DURATION", dynamicMLDura);
    let dynamicVIDura = getCMV("DYNA_VI_DURATION");
    if(isNaN(dynamicVIDura)){
        dynamicVIDura = getCMV("MIN_VI_DURATION");
    }
    dynamicVIDura *= (viFPS / getCMV("3D_FPS_LIMIT"));
    dynamicVIDura = Math.max(dynamicVIDura, getCMV("MIN_VI_DURATION"));
    dynamicVIDura = Math.min(dynamicVIDura, getCMV("MAX_VI_DURATION"));
    setCMV("DYNA_VI_DURATION", dynamicVIDura);
    setCMV("VI_LOOP_COUNTER", 0);
    setCMV("ML_LOOP_COUNTER", 0);
    viFPSQueue.push(viFPS);
    mlFPSQueue.push(mlFPS);
    if(mlHealthQueue.length == getCMV("FPS_WAIT")){
        mlHealthQueue.shift();
    }
    if(mlFPS > 15){
        mlHealthQueue.shift();
        if(mlHealthQueue.length == 0){
            mlHealthState = 0;
            clearAlert(viHealthState, mlHealthState);
        }
    }else{
        let state = 3;
        if(mlFPS > 5){
            state = 1;
        }else if(mlFPS > 0){
            state = 2;
        }
        mlHealthQueue.push(state);
        if(mlHealthQueue.length == getCMV("FPS_WAIT")){
            checkMLHealthQueue(state);
        }
    }
    if(viHealthQueue.length == getCMV("FPS_WAIT")){
        viHealthQueue.shift();
    }
    if(viFPS > 24){
        viHealthQueue.shift();
        if(viHealthQueue.length == 0){
            viHealthState = 0;
            clearAlert(viHealthState, mlHealthState);
        }
    }else{
        let state = 3;
        if(viFPS > 12){
            state = 1;
        }else if(viFPS > 0){
            state = 2;
        }
        viHealthQueue.push(state);
        if(viHealthQueue.length == getCMV("FPS_WAIT")){
            checkVIHealthQueue(state);
        }
    }
    if(viFPSQueue.length == getCMV("FPS_RATE")){
        let viFPSAvg = viFPSQueue.reduce((a, b) => a + b, 0) / getCMV("FPS_RATE");
        let mlFPSAvg = mlFPSQueue.reduce((a, b) => a + b, 0) / getCMV("FPS_RATE");
        console.log("FPS: ", prettyNumber(viFPSAvg), prettyNumber(mlFPSAvg));
        console.log("DEBUG INFO: ", dynamicVIDura, dynamicMLDura);
        viFPSQueue = [];
        mlFPSQueue = [];
    }
    if(Date.now() - getMetaTime() > 1000 * getCMV("HEALTH_WAIT")){
        setNewMeta();
        postImage();
    }
}

function getHealthLog(){
    let healthLog = {"general": {"3D-FPS": 0, "ML-FPS": 0}};
    if(viFPSQueue.length > 0){
        healthLog["general"]["3D-FPS"] = viFPSQueue[viFPSQueue.length - 1];
    }
    if(mlFPSQueue.length > 0){
        healthLog["general"]["ML-FPS"] = mlFPSQueue[mlFPSQueue.length - 1];
    }
    return healthLog;
}
