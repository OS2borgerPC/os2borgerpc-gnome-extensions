#!/bin/bash

# Author: Heini L. Ovason.

# Intended for creating symlinks between a gnome-extension development folder and $USER's gnome-extension folder.
# When new extention folders appear in the project you need to re-run this script.

PWD=$(pwd)
EXT_PROJECT_FOLDERS=$(ls --directory */)

# This is the folder where extension-folders need to be placed.
EXT_PATH="/home/$USER/.local/share/gnome-shell/extensions/"

for FOLDER in $EXT_PROJECT_FOLDERS
do
  ln --symbolic --force --target-directory="$EXT_PATH" "$PWD/$FOLDER"
done

