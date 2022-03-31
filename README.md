# OpenLive3D

<img src="asset/design/logo.png" width="150px"/>

The open source project for Live3D Virtual Avatar.

<img src="asset/design/screenshot.png" width="300px"/>


## Project Features

Current Virtual Avatar software often require

 - Easy to Use
 - Less Hardware Requirement
 - Highly Customizable


## Engineering Features

The project aims to connect the half-body movement with facial landmarks to the 3D `VRM` avatar.

 - Facial landmark model based on `TF.js`
 - Adjustable config to map landmarks to the avatar
 - Rich documentation
 - Modularized and flexible structure


## Step by Step Guide:

1. Open the OpenLive3D website: https://openlive3d.com/

2. Allow the camera capture

![Camera Permission](asset/doc/allow-camera.png)

3. Wait for 10 seconds
 - Avatar VRM Model Loading
 - Machine Learning Motion Tracker Connection

4. Click the OpenLive3D LOGO on the Top Left
 - Open the System Menu

![System Menu](asset/doc/system-menu.png)

5. Upload your own VRM file

![Upload](asset/doc/upload.png)

6. Change the setting if you would like

![Setting](asset/doc/setting.png)


## Project Architecture

![block-diagram](asset/design/block-diagram.png)

 - Media Source Manager
 - Facial Landmark Recognizer
 - Model Manager
 - Controller
 - Effect Manager
 - State Manager
 - Config Manager
 - Live3D GUI


## Development Status

Currently, the project is in its initialization state.

 - Initial documentation
 - Placeholder files creation
 - MVP Design
