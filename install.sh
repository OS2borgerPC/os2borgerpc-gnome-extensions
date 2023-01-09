#!/bin/bash

#set -x

# AuthorS: Heini L. Ovason, Marcus Funch
#
# Intended for creating symlinks between a gnome-extension development folder and $CHOSEN_USER's gnome-extension folder.
# When new extention folders appear in the project you need to re-run this script.
#
# This script is written to be runnable from anywhere, and from any user, including root.

CHOSEN_USER=$1
EXTENSION=$2
INSTALL=$3
COPY=$4
BORGERPC=${5-false}

EXTENSION_REPO_BASE_PATH="$(dirname "$(realpath "$0")")/extensions"
EXT_PROJECT_FOLDERS="$(ls --directory extensions/*)"

# This is the folder where extension-folders need to be placed.
#EXT_INSTALL_BASE_PATH_LOCAL="/home/$CHOSEN_USER/.local/share/gnome-shell/extensions/"
EXT_INSTALL_BASE_PATH_GLOBAL="/usr/share/gnome-shell/extensions/"
EXT_INSTALL_BASE_PATH=$EXT_INSTALL_BASE_PATH_GLOBAL

help() {
  printf "%s\n" "Usage: ./install.sh <USERNAME> <EXTENSION_NAME/all> <INSTALL (boolean)> <COPY (boolean)> <BorgerPC (boolean)>" \
                "Example: ./install.sh someuser logout-timer@os2borgerpc.magenta.dk true true true"
  exit 1
}

# We could enable the extension from here as well, but that doesn't work because the user needs to log out first.
# Unless we find the relevant command to live-reload gnome extensions, like dconf update
gnome_extension_enable_disable() {
  EXTENSION=$1
  ENABLE=$2

  if $ENABLE; then
    ENABLE_DISABLE=enable
  else
    ENABLE_DISABLE=disable
  fi

  su --login $CHOSEN_USER --command "DBUS_SESSION_BUS_ADDRESS="unix:path=/run/user/$(id -u $CHOSEN_USER)/bus" gnome-extensions $ENABLE_DISABLE $EXTENSION"
}

[ $# -lt 3 ] && help

if [ "$EXTENSION" = "all" ]; then
  for EXTENSION in $EXT_PROJECT_FOLDERS; do
    if "$INSTALL"; then
      if ! "$COPY"; then # Practical for development
        ln --symbolic --force "$EXTENSION_REPO_BASE_PATH/$EXTENSION" "$EXT_INSTALL_BASE_PATH"
      else # Better for installation
        cp -r "$EXTENSION_REPO_BASE_PATH/$EXTENSION" "$EXT_INSTALL_BASE_PATH"
      fi
    else
      rm --force "$CWD/$EXTENSION"
      gnome_extension_enable_disable "$EXTENSION" false
    fi
  done
else
  if "$INSTALL"; then
    if ! "$COPY"; then
      ln --symbolic --force "$EXTENSION_REPO_BASE_PATH/$EXTENSION" "$EXT_INSTALL_BASE_PATH"
    else
      cp -r "$EXTENSION_REPO_BASE_PATH/$EXTENSION" "$EXT_INSTALL_BASE_PATH"
    fi
  else
    rm --force "$EXTENSION_REPO_BASE_PATH/$EXTENSION"
    gnome_extension_enable_disable "$EXTENSION" false
  fi
fi

if "$BORGERPC"; then
  AUTOSTART_DESKTOP_FILE="/home/.skjult/.config/autostart/enable-$EXTENSION.desktop"
  mkdir --parents "$(dirname "$AUTOSTART_DESKTOP_FILE")"
	cat <<- EOF > "$AUTOSTART_DESKTOP_FILE"
		[Desktop Entry]
		Type=Application
		Exec=gnome-extensions enable $EXTENSION
	EOF

  chmod +x "$AUTOSTART_DESKTOP_FILE"
fi
