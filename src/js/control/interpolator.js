// interpolate for motion smoother

let arrTimeInfo = [];
let curTimeInfo = {
    "time": new Date().getTime(),
    "info": getDefaultFaceInfo()
};
let delayTime = 250; // milliseconds

function weightedAvg(o1, o2, w1, w2){
    let obj = {};
    Object.keys(o1).forEach(function(key){
        if(key in o2){
            obj[key] = o1[key] + (o2[key] - o1[key]) * w1 / (w1 + w2);
        }else{
            console.log("o2 missing: ", key);
            obj[key] = o1[key];
        }
    });
    return obj;
}

function pushInfo(newinfo){
    if(newinfo){
        if(arrTimeInfo.length >= 2){
            arrTimeInfo = [arrTimeInfo[1], {
                "time": new Date().getTime(),
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

function getInfo(){
    let lasTime = curTimeInfo["time"];
    let lasInfo = curTimeInfo["info"];
    let curTime = new Date().getTime();
    let difTime = curTime - lasTime;
    if(arrTimeInfo.length == 1){
        curTimeInfo = arrTimeInfo[0];
    }else if(arrTimeInfo.length == 2){
        let time0 = arrTimeInfo[0]["time"] + delayTime;
        let info0 = arrTimeInfo[0]["info"];
        let time1 = arrTimeInfo[1]["time"] + delayTime;
        let info1 = arrTimeInfo[1]["info"];
        if(time0 > lasTime){
            let cnt0 = (time0 - lasTime) / difTime;
            let cnt1 = (time1 - time0) / difTime;
            if(cnt0 > 3){
                curTimeInfo = {
                    "time": curTime,
                    "info": weightedAvg(lasInfo, info0, 1, cnt0 - 1)
                }
            }else{
                let parr = [];
                while(parr.length < 3 && cnt0 > 1){
                    let p = weightedAvg(lasInfo, info0, parr.length + 1, cnt0 - 1);
                    cnt0 -= 1;
                    parr.push(p);
                }
                while(parr.length < 3 && cnt1 > 0){
                    let p = weightedAvg(info0, info1, cnt0, cnt1 - cnt0);
                    cnt0 += 1;
                    parr.push(p);
                }
                parr[1] = weightedAvg(parr[0], parr[1], 1, 1);
                parr[0] = weightedAvg(parr[1], parr[2], 2, 1);
                curTimeInfo = {
                    "time": curTime,
                    "info": weightedAvg(lasInfo, parr[0], 1, 1)
                }
            }
        }else if(time1 > lasTime){
            let cnt1 = (time1 - lasTime) / difTime;
            curTimeInfo = {
                "time": curTime,
                "info": weightedAvg(lasInfo, info1, 1, cnt1 - 1)
            }
        }else{
            curTimeInfo = {
                "time": curTime,
                "info": info1
            }
        }
    }
    return curTimeInfo["info"];
}
