// interface

function getSavedConfig(){
    return document.cookie;
}
function setSavedConfig(saveString){
    document.cookie = saveString;
}

function onKeyUpHook(f){
    document.addEventListener("keyup", f);
}
