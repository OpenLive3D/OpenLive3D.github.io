// multi language
let defaultLanguage = "en";
let languageBox = [{
    "en": 'Model Manager',
    "zh": '模型管理'
}, {
    "en": 'Video Control',
    "zh": '錄影鏡頭管理'
}, {
    "en": 'Setting',
    "zh": '設定'
}, {
    "en": 'Parameters',
    "zh": '參數'
}, {
    "en": 'Upload VRM Model',
    "zh": '上傳 VRM 模型'
}, {
    "en": 'Set VRM URL',
    "zh": '設定 VRM 網址'
}, {
    "en": 'Set URL',
    "zh": '確認網址'
}, {
    "en": 'Image',
    "zh": '圖像'
}, {
    "en": 'Landmark',
    "zh": '標記'
}, {
    "en": 'Save Setting'
}, {
    "en": 'Save your settings in your browser as the cookie.'
}, {
    "en": 'Camera Flip'
}, {
    "en": 'Flip the camera horizontally.'
}, {
    "en": 'Language'
}, {
    "en": 'Select the language for the user interface.'
}, {
    "en": 'Breath Frequency'
}, {
    "en": 'Breath count per second, default as 0.3. Range(0, 4)'
}, {
    "en": 'Breath Strength'
}, {
    "en": 'The moving length of breathing effect, default as 1. Range(0, 10)'
}, {
    "en": 'MOOD_AUTO Ratio'
}, {
    "en": 'The dramatic-degree of the auto-mood detection, default as 2. Range(0, 10)'
}, {
    "en": 'MOOD_AUTO Offset'
}, {
    "en": 'Auto-mood works when the value is larger than the offset, default as 0.1. Range(0, 1)'
}, {
    "en": '3D_FPS Limit'
}, {
    "en": 'The FPS limit for 3D rendering visualization, default as 120. Range(1, 120)'
}, {
    "en": 'ML_FPS Limit'
}, {
    "en": 'The FPS limit for ML computation, default as 120. Range(1, 120)'
}, {
    "en": 'Background Color'
}, {
    "en": 'Accept Color Code with "#" or "rgba", "hsla"'
}, {
    "en": 'Upload Image'
}, {
    "en": 'Upload an image as your background'
}, {
    "en": 'Sensitivity Scale'
}, {
    "en": 'The higher this value is, the more overall sensitive it is to human movement, default as 1. Range(0.1, 3).'
}, {
    "en": 'Motion Blur Ratio'
}, {
    "en": 'The higher this value is, the smoother the body motion is, default as 1.5. Range(0, 10).'
}, {
    "en": 'Momentum Ratio'
}, {
    "en": 'The higher this value is, the smoother the body motion is, default as 1.5. Range(0, 10).'
}, {
    "en": 'Head Rotate Ratio'
}, {
    "en": 'The multiplication parameter to rotate the head as the head rotation. Range(-2, 2)'
}, {
    "en": 'Neck Rotate Ratio'
}, {
    "en": 'The multiplication parameter to rotate the neck as the head rotation. Range(-2, 2)'
}, {
    "en": 'Chest Rotate Ratio'
}, {
    "en": 'The multiplication parameter to rotate the chest as the head rotation. Range(-2, 2)'
}, {
    "en": 'Head Stablize Ratio'
}, {
    "en": 'Motion become more stable with larger value, but small gesture become harder to track. Avatar stop moving when the value is 1. Range(0, 0.95)'
}, {
    "en": 'Body Stablize Ratio'
}, {
    "en": 'Motion become more stable with larger value, but small gesture become harder to track. Avatar stop moving when the value is 1. Range(0, 0.95)'
}, {
    "en": 'Mouth Open Offset'
}, {
    "en": 'Mouth will only open after the openness value is larger than the offset. Range(0, 1)'
}, {
    "en": 'Mouth Open Ratio'
}, {
    "en": 'The multiplication parameter for mouth openness. Range(0, 20)'
}, {
    "en": 'Mouth Stablize Ratio'
}, {
    "en": 'Motion become more stable with larger value, but small gesture become harder to track. Avatar stop moving when the value is 1. Range(0, 0.95)'
}, {
    "en": 'Brows Open Offset'
}, {
    "en": 'Brows will only open after the openness value is larger than the offset. Range(0, 1)'
}, {
    "en": 'Brows Open Ratio'
}, {
    "en": 'The multiplication parameter for brows openness. Range(0, 20)'
}, {
    "en": 'Brows Stablize Ratio'
}, {
    "en": 'Motion become more stable with larger value, but small gesture become harder to track. Avatar stop moving when the value is 1. Range(0, 0.95)'
}, {
    "en": 'Eyes Sync'
}, {
    "en": 'Force the eyes to sync or not. Accept "true|false" value'
}, {
    "en": 'Eyes Link'
}, {
    "en": 'The threshold that control the coherent of the 2 eyes. When the absolute difference of the 2 eyes openness is smaller then the value, the 2 eyes will move together. Range(0, 1)'
}, {
    "en": 'Eye Stablize Ratio'
}, {
    "en": 'Motion become more stable with larger value, but small gesture become harder to track. Avatar stop moving when the value is 1. Range(0, 0.95)'
}, {
    "en": 'Iris Offset'
}, {
    "en": 'The offset of iris turning, default 0.0. Range(-1, 1)'
}, {
    "en": 'Iris Ratio'
}, {
    "en": 'The ratio of iris turning speed, default 5.0. Range(0, 20)'
}, {
    "en": 'Right Eye Close'
}, {
    "en": 'Close the eye when the openness is small than the threshold. Range(0, 1)'
}, {
    "en": 'Right Eye Open'
}, {
    "en": 'Fully open the eye when the openness is larger than the threshold. Range(0, 1)'
}, {
    "en": 'Right Eye Squint'
}, {
    "en": 'The ratio of half-open eye between fully open and close. Range(0, 1)'
}, {
    "en": 'Left Eye Close'
}, {
    "en": 'Close the eye when the openness is small than the threshold. Range(0, 1)'
}, {
    "en": 'Left Eye Open'
}, {
    "en": 'Fully open the eye when the openness is larger than the threshold. Range(0, 1)'
}, {
    "en": 'Left Eye Squint'
}, {
    "en": 'The ratio of half-open eye between fully open and close. Range(0, 1)'
}, {
    "en": 'Hand Tracking'
}, {
    "en": 'Hand tracking is enabled or not.'
}, {
    "en": 'Hand Stablize Ratio'
}, {
    "en": 'Motion become more stable with larger value, but small gesture become harder to track. Avatar stop moving when the value is 1. Range(0, 0.95)'
}, {
    "en": 'Finger Grip Ratio'
}, {
    "en": 'Control the grip ratio of fingers. Default to 1. Range(0, 5)'
}, {
    "en": 'Finger Spread Ratio'
}, {
    "en": 'Control the spread ratio of fingers. Default to 1. Range(0, 5)'
}, {
    "en": 'Position X Ratio'
}, {
    "en": 'The larger the number is, the faster the VRM model move horizontally. Range(-1, 1)'
}, {
    "en": 'Position Y Ratio'
}, {
    "en": 'The larger the number is, the faster the VRM model move vertically. Range(-1, 1)'
}, {
    "en": 'Position Z Ratio'
}, {
    "en": 'The larger the number is, the faster the VRM model move forward and backward. Range(-1, 1)'
}, {
    "en": "Upload VRM Model"
}, {
    "en": "Set VRM URL"
}, {
    "en": "Official Discord"
}, {
    "en": "general"
}, {
    "en": "face"
}, {
    "en": "pose"
}, {
    "en": "left_hand"
}, {
    "en": "right_hand"
}, {
    "en": 'GENERAL'
}, {
    "en": 'BACKGROUND'
}, {
    "en": 'SMOOTH'
}, {
    "en": 'BODY'
}, {
    "en": 'MOUTH'
}, {
    "en": 'BROWS'
}, {
    "en": 'EYE_GENERAL'
}, {
    "en": 'EYE_RIGHT'
}, {
    "en": 'EYE_LEFT'
}, {
    "en": 'HAND'
}, {
    "en": 'POSITION'
}, {
    "en": "ALERT: Full Screen / Wrong Tab<br/>Browser will stop rendering when other program enters full screen!"
}, {
    "en": "ALERT: Error<br/>ML loop stop running, might need to restart to validate."
}, {
    "en": "ALERT: Hardware Acceleration<br/>ML loop is running extremely slow, check if hardware acceleration is opened."
}, {
    "en": "ALERT: Ultra Fast<br/>ML loop is running slowly, improve performance by using FACE-ONLY mode."
}, {
    "en": "ALERT: Slow<br/>Feel free to contact developer for more information."
}, {
    "en": "MOBILE NOT SUPPORTED!!"
}, {
    "en": "SAFARI NOT SUPPORTED!!"
}, {
    "en": "Safari has no stable support for image processing in web-worker today (2023-03-12)"
}, {
    "en": "Please use other browsers for now."
}, {
    "en": "Integration Validating..."
}, {
    "en": "VRM-Model Loading..."
}, {
    "en": "FaceLandMark-Model Loading..."
}, {
    "en": "Camera Loading..."
}];

function getL(str){
    let currentLanguage = getCMV("LANGUAGE");
    if(currentLanguage == defaultLanguage){
        return str;
    }
    for(let sentence of languageBox){
        if(sentence[defaultLanguage] == str){
            if(currentLanguage in sentence){
                return sentence[currentLanguage];
            }else{
                return str;
            }
        }
    }
    return str;
}
