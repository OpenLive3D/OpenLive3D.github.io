# Config Definition


## BG_COLOR (Background Color)

Accept Color Code with "#" or "rgba", "hsla"'


## MOUTH_RATIO (Mouth Open Ratio)

The multiplication parameter for mouth openness. Range(0, 20)


## CHEST_RATIO (Chest Rotate Ratio)

The multiplication parameter to rotate the chest as the head rotation. Range(-1, 1)


## EYE_LINK_THRESHOLD (Eyes Link)

The threshold that control the coherent of the 2 eyes. When the absolute difference of the 2 eyes openness is smaller then the value, the 2 eyes will move together. Range(0, 1)


## RIGHT_EYE_CLOSE_THRESHOLD (Right Eye Close)

Close the eye when the openness is small than the threshold. Range(0, 1)


## LEFT_EYE_CLOSE_THRESHOLD (Left Eye Close)

Close the eye when the openness is small than the threshold. Range(0, 1)


## RIGHT_EYE_OPEN_THRESHOLD (Right Eye Open)

Fully open the eye when the openness is larger than the threshold. Range(0, 1)


## LEFT_EYE_OPEN_THRESHOLD (Left Eye Open)

Fully open the eye when the openness is larger than the threshold. Range(0, 1)


## RIGHT_EYE_SQUINT_RATIO (Right Eye Squint)

The ratio of half-open eye between fully open and close. Range(0, 1)


## LEFT_EYE_SQUINT_RATIO (Left Eye Squint)

The ratio of half-open eye between fully open and close. Range(0, 1)


## IRIS_POS_OFFSET (Iris Offset)

The offset of iris turning, default 0.0. Range(-1, 1)


## IRIS_POS_RATIO (Iris Ratio)

The ratio of iris turning speed, default 5.0. Range(0, 20)


## STABLIZE_RATIO (Stablize Ratio)

Motion become more stable with larger value, but small guesture become harder to track. Avatar stop moving when the value is 1. Range(0, 0.95)


## CAMERA_FLIP (Camera Flip)

Flip the camera horizontally. Accept "true|false" value

