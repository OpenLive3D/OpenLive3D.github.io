// effect

function initEffect(){
}

function enableBlurEffect(){
    let divvrm = document.getElementById("div-vrm");
    divvrm.style['-webkit-backdrop-filter'] = 'blur(5px)';
    divvrm.style['-moz-filter'] = 'blur(5px)';
    divvrm.style['-o-filter'] = 'blur(5px)';
    divvrm.style['-ms-filter'] = 'blur(5px)';
    divvrm.style['filter'] = 'blur(5px)';
}
function disableBlurEffect(){
    let divvrm = document.getElementById("div-vrm");
    divvrm.style['-webkit-backdrop-filter'] = '';
    divvrm.style['-moz-filter'] = '';
    divvrm.style['-o-filter'] = '';
    divvrm.style['-ms-filter'] = '';
    divvrm.style['filter'] = '';
}

function adjustLightColorEffect(){
    let light = getDirectionalLight();
    light.color = new THREE.Color(0xff0000);
}
function resetLightColorEffect(){
    let light = getDirectionalLight();
    light.color = new THREE.Color(0xffffff);
}

function enableBubbleEffect(){
}
function disableBubbleEffect(){
}
function updateBubbleEffect(delta){
}

function getAllEffects(){
    return {
        "Screen Modification": [{
            'key': 'BLUR',
            'title': 'Blur',
            'describe': 'Blur the output screen',
            'type': 'screen', // screen | object | particle
            'enableEffect': enableBlurEffect,
            'disableEffect': disableBlurEffect
        }],
        "Flare / Lighting": [{
            'key': 'LIGHT_COLOR',
            'title': 'Direct Light Color',
            'describe': 'The color of the directional light',
            'type': 'flare', // screen | object | particle
            'enableEffect': adjustLightColorEffect,
            'disableEffect': resetLightColorEffect
        }],
        "Particle Effects": [{
            'key': 'BUBBLE',
            'title': 'Bubble',
            'describe': 'Emit bubbles',
            'type': 'flare', // screen | object | particle
            'enableEffect': enableBubbleEffect,
            'disableEffect': disableBubbleEffect,
            'updateEffect': updateBubbleEffect
        }]
    }
}