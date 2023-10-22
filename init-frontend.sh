#!/bin/sh

C:/Users/antho/AppData/Local/Android/Sdk/emulator/emulator -avd Pixel_6_API_34 -wipe-data &

sleep 200;

C:/Users/antho/AppData/Local/Android/Sdk/platform-tools/adb reverse tcp:8080 tcp:8080;

cd frontend;
npm install;
npm run android;