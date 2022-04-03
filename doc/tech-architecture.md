# Project Architecture

![block-diagram](asset/design/block-diagram.png)

 - Media Source Manager
 - Facial Landmark Recognizer
 - Model Manager
 - Controller
 - Effect Manager
 - State Manager
 - Config Manager
 - Live3D GUI

## Media Source Manager

Media source manager will handle the camera sources.

## Facial Landmark Recognizer

Facial landmark recognizer, use the `TF.js` model to output landmark information based on camera screenshots.

## Model manager

Model manager controls the `VRM` files.

## Controller

Controller will interact with all modules to coordinate information.

## Effect Manager

Effect manager handles the canvas effects.

## State Manager

State manager will keep and save the current state.

## Config Manager

Config manager will handle the config files that save different conditions for different models.

## Live3D GUI

Live3D GUI provides the graphical interface for human to operate and do modification.
