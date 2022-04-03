# How to set Parameters?

Note: Make sure to have enough light to your face. The light will affect the facial landmark extraction result.


## Set Eye Open Threshold `open threshold`

By observing the real-time `eye open` parameters, you can set `RIGHT_EYE_OPEN_THRESHOLD` and `LEFT_EYE_OPEN_THRESHOLD` to the normal open ratio.

By setting the normal open ratio as the `open threshold`, the eyes will be fully open most of the time.

However, if you don't want the eyes to be fully open constantly, you can set the `open threshold` a bit higher.


## Set Eye Close Threshold `close threshold`

By squinting your eyes and observing the real-time `eye open` parameters, you can set `RIGHT_EYE_CLOSE_THRESHOLD` and `LEFT_EYE_CLOSE_THRESHOLD`.

Note that the `eye open` parameters will not be 0 even when the eyes are fully closed. The values changed from person to person based on their facial features.

Thse `close threshold` are recommended to be set a bit higher than your fully closed eyes, so it is easier to be detected under different light environment.

