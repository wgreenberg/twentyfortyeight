const Gtk = imports.gi.Gtk;
const Lang = imports.lang;

const TileView = imports.views.tileView;

const NUM_ROWS = 4;
const NUM_COLS = 4;

const BoardView = Lang.Class({
    Name: 'BoardView',
    GTypeName: 'BoardView',
    Extends: Gtk.Grid,

    _init: function (props) {
        this.parent(props);
        this._grid = [];
        for (let i = 0; i < NUM_ROWS; i++) {
            this._grid[i] = [];
            for (let j = 0; j < NUM_COLS; j++) {
                let tile = new TileView.TileView();
                this._grid[i][j] = tile;
                this.attach(tile, j, i, 1, 1);
            }
        }
    },

    _clearGrid: function () {
        for (let i = 0; i < NUM_ROWS; i++) {
            for (let j = 0; j < NUM_COLS; j++) {
                this._grid[i][j].value = 0;
            }
        }
    },

    set tiles (v) {
        this._clearGrid();
        v.forEach((tile) => {
            this._grid[tile.row][tile.col].value = tile.tile.value;
        });
    },
});
