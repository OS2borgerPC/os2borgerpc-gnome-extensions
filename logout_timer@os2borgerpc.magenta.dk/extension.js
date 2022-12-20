/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

const GETTEXT_DOMAIN = 'logout-timer-extension';

const { GObject, St } = imports.gi;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const ByteArray = imports.byteArray;

const _ = ExtensionUtils.gettext;

// format: TIME_MINUTES=<MINUTES>
//const logout_timers_conf_file = '/usr/share/os2borgerpc/logout_timer.conf'
const logout_timers_conf_file = '/home/heini/.local/share/gnome-shell/extensions/logout_timer@os2borgerpc.magenta.dk/logout_timer.conf'

/* exported arrayToString */
function arrayToString(array) {
    if (array instanceof Uint8Array) {
        return ByteArray.toString(array);
    }
    return array.toString();
}


const Indicator = GObject.registerClass(
    class Indicator extends PanelMenu.Button {
        _init() {
            super._init(0.0, _('Logout Timer'));

            const file = Gio.file_new_for_path(logout_timers_conf_file);
            const [result, contents] = file.load_contents(null);
            if (!result) {
                this.logger.error(`Could not read file: ${this.path}`);
                throw new Errors.IoError(`JsTextFile: trying to load non-existing file ${this.path}`,
                    this.logger.error);
            }
            let content = arrayToString(contents);

            let sec = content.split("=")[1]

            let lbl = new St.Label({
                style_class: 'system-status-icon'
            })
            this.add_child(lbl)

            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms))
            }

            (async () => {
                while (sec >= 0) {
                    await sleep(1000)
                    lbl.set_text(sec.toString())
                    sec--
                }
                // Ref: https://gjs.guide/guides/gio/subprocesses.html#asynchronous-communication
                try {
                    GLib.spawn_command_line_async('gnome-session-quit --force');
                } catch (e) {
                    logError(e);
                }

            })();
        }
    });

class Extension {
    constructor(uuid) {
        this._uuid = uuid;

        ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
    }

    enable() {
        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this._uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}
