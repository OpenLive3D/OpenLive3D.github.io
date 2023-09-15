# Control

Controller will interact with all modules to coordinate information.

## Functions

 - Initialize
   - List / Start Default Camera
   - Load Facial Landmark ML Model
   - Initialize Default State
 - Event Trigger
   - Select and Load Camera / Config
   - Create / Remove / Update Config
 - Loop
   - Screen Capture
   - Extract Facial Landmark
   - Update State
   - Generate Canvas
   - Apply Effects

## Re-Write

Target is to simplify the integration.

 - core separation
 - arm-magic / interpolator should be in the core
 - basic integration should be:
   - Init
     - Config Init
     - Motion Capture Init
       - Camera Init
       - ML Init
     - 3D Scene Init
   - Loop
     - Obtain Motion
       - with core (need camera)
       - with 3PD integration (camera + ML will be handled)
     - Move 3D Model
     - Config Change by User

