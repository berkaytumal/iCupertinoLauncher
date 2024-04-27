devices=$(adb devices | grep -v "List of devices attached" | cut -f 1)
source_folder="/Users/berkaytumal/LocalProjects(Mac)/iCupertinoLauncher"
destination_folder="/sdcard/iCupertino"
NODE_MODULES=(
    "jquery"
    "css-houdini-squircle"
)
for device in $devices; do
    echo "$device is being uploaded..."
    adb -s $device shell rm -rf /sdcard/iCupertino/ > /dev/null 2>&1
    if [ ! -d "$source_folder" ]; then
        echo "Source folder does not exist!"
        exit 1
    fi
    for item in "$source_folder"/*; do
        if [ -f "$item" ] && [ "$(basename "$item")" != "node_modules" ]; then
            adb -s $device push "$item" "$destination_folder/"$(basename "$item") > /dev/null 2>&1
        fi
    done
    for item in "$source_folder"/*; do
        if [ -d "$item" ] && [ "$(basename "$item")" != "node_modules" ]; then
            adb -s $device push "$item" "$destination_folder/"$(basename "$item") > /dev/null 2>&1
        fi
    done
    for module in "${NODE_MODULES[@]}"; do
        adb -s $device push "/Users/berkaytumal/LocalProjects(Mac)/iCupertinoLauncher/node_modules/$module" "/sdcard/iCupertino/node_modules/$module" > /dev/null 2>&1
    done
    echo "$device DONE!"
done
