const Gtk = imports.gi.Gtk;
const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Lang = imports.lang;

GObject.ParamFlags.READWRITE = GObject.ParamFlags.READABLE | GObject.ParamFlags.WRITABLE;

const TILE_WIDTH = 200;
const TILE_HEIGHT = 200;

const TileView = Lang.Class({
    Name: 'TileView',
    GTypeName: 'TileView',
    Extends: Gtk.Box,

    Properties: {
        'value': GObject.ParamSpec.int('value', 'Value',
            'The value of this tile',
             GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
             0, GLib.MAXINT32, 0),
    },

    _init: function (props) {
        this._label = new Gtk.Label({
            halign: Gtk.Align.CENTER,
            valign: Gtk.Align.CENTER,
            expand: true,
        });
        this.parent(props);

        let context = this.get_style_context();
        context.add_class('tile');

        this.add(this._label);
    },

    set value (v) {
        let context = this.get_style_context();
        let prev_value = this._label.label;
        context.remove_class('tile-' + prev_value);

        if (v === 0) {
            this._label.label = '';
        } else {
            context.add_class('tile-' + v);
            this._label.label = '' + v;
        }
    },

    vfunc_get_request_mode: function () {
        return Gtk.SizeRequestMode.CONSTANT_SIZE;
    },

    vfunc_get_preferred_width: function () {
        return [TILE_WIDTH, TILE_WIDTH];
    },

    vfunc_get_preferred_height: function () {
        return [TILE_HEIGHT, TILE_HEIGHT];
    },
});
