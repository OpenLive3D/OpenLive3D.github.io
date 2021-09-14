# OpenLive3D

<img src="asset/design/logo.png" width="150px"/>

The open source project for Live3D Virtual Avatar.

## Features

The project aims to connect the half-body movement with facial landmarks to the 3D `VRM` avatar.

 - Facial landmark model based on `TF.js`
 - Adjustable config to map landmarks to the avatar
 - Rich documentation
 - Modularized and flexible structure

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

## Development Logs

 - 2021-08-26: Project creation
 - 2021-08-29: [Create MVP Development Plan](log/2021-08-28-MVP-Development-Process.md)
   - Complete: Show Camera on Screen
   - Complete: Show Landmarks and Info
 - 2021-09-08: [Create Word Definition](log/2021-09-08-Word-Definition.md)
 - 2021-09-09: [Create Dependencies](log/2021-09-09-Dependencies.md)
   - Complete: Show Avatar
 - 2021-09-10: MVP Scope add Avatar Link
   - Complete: Operate Avatar
 - 2021-09-12: three.js:v0.132.2 three-vrm:v0.6.6
   - Complete: Avatar and Landmark Info Link
 - 2021-09-15: [Create Alpha Development Plan](log/2021-09-15-Alpha-Development-Process.md)
