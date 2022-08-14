// interpolate for motion smoother

let arrTimeInfo = [];
let curTimeInfo = {
    "time": new Date().getTime(),
    "info": getDefaultInfo()
};
let delayTime = 250; // milliseconds
let lasInfoDiff = getDefaultInfo();
let lasTimeDiff = 30;

function weightedAvg(o1, o2, w1, w2){
    let obj = {};
    Object.keys(o1).forEach(function(key){
        obj[key] = o1[key] + (o2[key] - o1[key]) * w1 / (w1 + w2);
    });
    return obj;
}

function calInfoDiff(o1, o2){
    let obj = {};
    Object.keys(o1).forEach(function(key){
        obj[key] = o2[key] - o1[key];
    });
    return obj;
}

function calScaleDiff(o1, w1){
    Object.keys(o1).forEach(function(key){
        o1[key] *= w1;
    });
}

function sumInfoDiff(o1, o2){
    let obj = {};
    Object.keys(o1).forEach(function(key){
        obj[key] = o2[key] + o1[key];
    });
    return obj;
}

function pushInfo(newinfo){
    let motionBlurFactor = getCMV("MOTION_BLUR_RATIO");
    if(newinfo){
        if(arrTimeInfo.length >= 2){
            let t0 = arrTimeInfo[0]["time"];
            let t1 = arrTimeInfo[1]["time"];
            let t2 = new Date().getTime();
            let t0diff = t1 - t0;
            let t1diff = t2 - t1;
            let smoothInfo = weightedAvg(
                arrTimeInfo[1]["info"],
                weightedAvg(
                    arrTimeInfo[0]["info"],
                    newinfo, t0diff, t1diff
                ), 1, motionBlurFactor);
            arrTimeInfo = [{
                "time": t1,
                "info": smoothInfo
            }, {
                "time": t2,
                "info": newinfo
            }];
        }else{
            arrTimeInfo.push({
                "time": new Date().getTime(),
                "info": newinfo
            })
        }
    }else{
        console.log("empty info alert!");
    }
}

let interCheck = {};
function addIC(t){
    if(t in interCheck){
        interCheck[t] += 1;
    }else{
        interCheck[t] = 1;
    }
}
function getInfo(){
    let momentumFactor = getCMV("MOMENTUM_RATIO");
    let lasTime = curTimeInfo["time"];
    let lasInfo = curTimeInfo["info"];
    let curTime = new Date().getTime();
    let difTime = curTime - lasTime;
    if(arrTimeInfo.length == 1){
        curTimeInfo = arrTimeInfo[0];
        addIC("l1");
    }else if(arrTimeInfo.length >= 2){
        let time0 = arrTimeInfo[0]["time"] + delayTime;
        let info0 = arrTimeInfo[0]["info"];
        let time1 = arrTimeInfo[1]["time"] + delayTime;
        let info1 = arrTimeInfo[1]["info"];
        if(time0 > lasTime){
            let cnt0 = (time0 - lasTime) / difTime;
            curTimeInfo = {
                "time": curTime,
                "info": weightedAvg(lasInfo, info0, 1, cnt0 - 1)
            }
            addIC("l2 t0");
        }else if(time1 > lasTime){
            let cnt1 = (time1 - lasTime) / difTime;
            curTimeInfo = {
                "time": curTime,
                "info": weightedAvg(lasInfo, info1, 1, cnt1 - 1)
            }
            addIC("l2 t1");
        }else{
            curTimeInfo = {
                "time": curTime,
                "info": arrTimeInfo[1]["info"]
            }
            addIC("l2 t?");
        }
    }
    let curInfoDiff = calInfoDiff(lasInfo, curTimeInfo["info"]);
    calScaleDiff(lasInfoDiff, difTime / lasTimeDiff);
    lasInfoDiff = weightedAvg(lasInfoDiff, curInfoDiff, momentumFactor, 1);
    let minVIDura = getCMV("MIN_VI_DURATION");
    let maxVIDura = getCMV("MAX_VI_DURATION");
    lasTimeDiff = Math.min(maxVIDura, Math.max(minVIDura, difTime));
    curTimeInfo["info"] = sumInfoDiff(curTimeInfo["info"], lasInfoDiff);
    return curTimeInfo["info"];
}
