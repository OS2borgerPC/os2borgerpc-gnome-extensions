# References

[A Guide to JavaScript for GNOME](https://gjs.guide/)

[GJS API References](https://gjs-docs.gnome.org/)

[wiki.gnome.org](https://wiki.gnome.org/)

# Development

In order to activate/deactivate a given extension the project folder must be placed in the gnome-shell extention folder:

```/home/$USER/.local/share/gnome-shell/extensions/```

When developing you want the to git clone this project to your workspace like a normal person, and then create symlinks to avoid copying the given project-folder from your workspace to the gnome-shell extension folder each time you make change, e.g. like so:

```ln -s /home/$USER/<workspace>/gnome-extensions/logout_timer@os2borgerpc.magenta.dk /home/$USER/.local/share/gnome-shell/extensions/logout_timer@os2borgerpc.magenta.dk```

BUT... in order to see your changes you must reload your extension.

> "Extensions can not be unloaded from a running instance of GNOME Shell. This can make testing incremental changes tedious. The most convenient way to test incremental changes, especially for Wayland users, is by running a nested instance of GNOME Shell. Running the following command from a terminal will start a new gnome-shell process, with its own D-Bus session:"

```dbus-run-session -- gnome-shell --nested --wayland```

Read more about debugging [HERE](https://gjs.guide/extensions/development/debugging.html)