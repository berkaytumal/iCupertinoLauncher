adb shell rm -rf /sdcard/iCupertino/
source_folder="/Users/berkaytumal/LocalProjects(Mac)/iCupertinoLauncher"
destination_folder="/sdcard/iCupertino"
if [ ! -d "$source_folder" ]; then
  echo "Source folder does not exist!"
  exit 1
fi
for item in "$source_folder"/*; do
  if [ -f "$item" ] && [ "$(basename "$item")" != "node_modules" ]; then
    adb push "$item" "$destination_folder/"$(basename "$item")
    echo $item
  fi
done
for item in "$source_folder"/*; do
  if [ -d "$item" ] && [ "$(basename "$item")" != "node_modules" ]; then
    adb push "$item" "$destination_folder/"$(basename "$item")
    echo $item
  fi
done
NODE_MODULES=(
  "jquery"
  "css-houdini-squircle"
)
for module in "${NODE_MODULES[@]}"; do
  adb push "/Users/berkaytumal/LocalProjects(Mac)/iCupertinoLauncher/node_modules/$module" "/sdcard/iCupertino/node_modules/$module"
  echo "/Users/berkaytumal/LocalProjects(Mac)/iCupertinoLauncher/node_modules/$module" to "/sdcard/iCupertino/node_modules/$module"
done
echo "Folder sent successfully (excluding node_modules)!"