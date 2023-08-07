# References

[A Guide to JavaScript for GNOME](https://gjs.guide/)

[GJS API References](https://gjs-docs.gnome.org/)

[wiki.gnome.org](https://wiki.gnome.org/)

# Development

In order to activate/deactivate a given extension, the project folder must be placed in the gnome-shell extension directory:

`/home/$USER/.local/share/gnome-shell/extensions/`

...or globally:

`/usr/share/gnome-shell/extensions/`

When developing you can clone this project to somewhere under your home directory, and then create symlinks in there to avoid copying
the given project-folder from your workspace to the gnome-shell extension folder each time you make change, e.g. like so:

```bash
ln -s /home/$USER/<workspace>/os2borgerpc-gnome-extensions/logout_timer@os2borgerpc.magenta.dk /home/$USER/.local/share/gnome-shell/extensions/
```

For this we've created a `justfile` containing various commands, some of which you need to re-run each time you create a new extension project folder.
Read more about `just` [here](https://github.com/casey/just/).

To install all extensions in the repo via `just`:
```bash
just install-all
```

To install a specific extension from the repo:
```bash
just install logout_timer@os2borgerpc.magenta.dk
```

NOTE THAT in order to see changes you've made to the code, you need to reload the extension.

> "Extensions can not be unloaded from a running instance of GNOME Shell. This can make testing incremental changes tedious. The most convenient way to test incremental changes, especially for Wayland users, is by running a nested instance of GNOME Shell. Running the following command from a terminal will start a new gnome-shell process, with its own D-Bus session:"

The `justfile` has a command for that:

```bash
just restart-child-gnome-shell
```

Read more about GNOME extension debugging [HERE](https://gjs.guide/extensions/development/debugging.html).
