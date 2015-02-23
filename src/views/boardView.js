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

    vfunc_get_request_mode: function () {
        return Gtk.SizeRequestMode.CONSTANT_SIZE;
    },

    vfunc_get_preferred_width: function () {
        let spacing = this.column_spacing * (NUM_COLS - 1);
        let size = spacing + TileView.TILE_WIDTH * NUM_COLS;
        return [size, size];
    },

    vfunc_get_preferred_height: function () {
        let spacing = this.row_spacing * (NUM_ROWS - 1);
        let size = spacing + TileView.TILE_HEIGHT * NUM_ROWS;
        return [size, size];
    },
});
