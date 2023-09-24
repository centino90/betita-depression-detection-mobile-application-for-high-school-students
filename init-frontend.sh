#!/bin/sh

C:/Users/antho/AppData/Local/Android/Sdk/emulator/emulator -avd Pixel_3a_API_34_extension_level_7_x86_64 -wipe-data &

sleep 120;

C:/Users/antho/AppData/Local/Android/Sdk/platform-tools/adb reverse tcp:8080 tcp:8080;

cd frontend;
npm install;
npm run android;