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

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const ByteArray = imports.byteArray;

const _ = ExtensionUtils.gettext;

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

        /*
        this.add_child(new St.Icon({
            icon_name: 'face-smile-symbolic',
            style_class: 'system-status-icon',
        }));
        */

        let lbl = new St.Label
        lbl.set_text("hey-ya")
        this.add_child(lbl)


        /* const file = Gio.file_new_for_path("/home/m/mjav.txt");
        const [result, contents] = file.load_contents(null);
        if (!result) {
            this.logger.error(`Could not read file: ${this.path}`);
            throw new Errors.IoError(`JsTextFile: trying to load non-existing file ${this.path}`,
                this.logger.error);
        }
        let content = arrayToString(contents); */

/*         setTimeout(function(){
            lbl.set_text(content)
        }, 8000); */
        
        let i = 10
        function test() {
            lbl.set_text(c.toString())
            i--;
        }
        setInterval(test(), (i*1000));
        /*
        let item = new PopupMenu.PopupMenuItem(_('Show Notification'));
        item.connect('activate', () => {
            Main.notify(_('Whatʼs up, volkswagen?'));
        });
        this.menu.addMenuItem(item);
        */
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
