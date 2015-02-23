const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Lang = imports.lang;

GObject.ParamFlags.READWRITE = GObject.ParamFlags.READABLE | GObject.ParamFlags.WRITABLE;

const TileModel = Lang.Class({
    Name: 'TileModel',
    GTypeName: 'TileModel',
    Extends: GObject.Object,

    Properties: {
        'value': GObject.ParamSpec.int('value', 'Value',
            'The value of this tile',
             GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
             2, GLib.MAXINT32, 2),
    },

    _init: function (props) {
        this.parent(props);
    },

    double: function () {
        this.value <<= 1;
    },
});
