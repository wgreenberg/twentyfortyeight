const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Lang = imports.lang;

GObject.ParamFlags.READWRITE = GObject.ParamFlags.READABLE | GObject.ParamFlags.WRITABLE;

const TileModel = imports.models.tileModel;

const NUM_ROWS = 4;
const NUM_COLS = 4;

const BoardPresenter = Lang.Class({
    Name: 'BoardPresenter',
    GTypeName: 'BoardPresenter',
    Extends: GObject.Object,

    Signals: {
        'tile-scored': {
            param_types: [GObject.TYPE_INT],
        },
    },

    Properties: {
        'model': GObject.ParamSpec.object('model', 'Model',
            'The board model',
            GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT_ONLY,
            GObject.Object.$gtype),
        'view': GObject.ParamSpec.object('view', 'View',
            'The board view',
            GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT_ONLY,
            GObject.Object.$gtype),
    },

    _init: function (props) {
        this.parent(props);
    },

    restart: function () {
        this.addRandomTile();
        this.addRandomTile();
        this.updateView();
    },

    mergeRight: function () {
        let tiles = this.model.tiles;
        for (let rownum=0; rownum < NUM_ROWS; rownum++) {
            let row = tiles.filter((tile) => {
                return tile.row === rownum;
            }).sort((a, b) => {
                if (a.col < b.col) return -1;
                else if (a.col > b.col) return 1;
                return 0;
            }).reverse();
            if (row.length > 1) {
                this._mergeRow(row[0], row[1], row.slice(2));
            }
        }
        this.model.packRight();
        return !this._areTileGridsEqual(tiles, this.model.tiles);
    },

    _areTileGridsEqual: function (grid1, grid2) {
        if (grid1.length !== grid2.length) {
            return false;
        }

        // for every tile in grid1, there should be an equal one in grid2
        return grid1.every((tile) => {
            let matches = grid2.filter((otherTile) => {
                return otherTile.row === tile.row
                    && otherTile.col === tile.col
                    && otherTile.tile.value === tile.tile.value;
            });
            return matches.length === 1;
        });
    },

    _mergeRow: function (first, second, rest) {
        if (first.tile.value === second.tile.value) {
            this.emit('tile-scored', first.tile.value);
            this.model.remove(first.row, first.col);
            second.tile.double();
            if (rest.length > 1) {
                return this._mergeRow(rest[0], rest[1], rest.slice(2));
            }
        } else {
            if (rest.length >= 1) {
                return this._mergeRow(second, rest[0], rest.slice(1));
            }
        }
    },

    addRandomTile: function () {
        let unusedTiles = this.model.empty;
        if (unusedTiles.length === 0)
            return;
        let randomIndex = GLib.random_int_range(0, unusedTiles.length);
        let {row, col} = unusedTiles[randomIndex];
        let newTile = new TileModel.TileModel();
        this.model.add(newTile, row, col);
    },

    updateView: function () {
        this.view.tiles = this.model.tiles;
    },

    moveRight: function () {
        let didTilesChange = this.mergeRight();

        if (didTilesChange) {
            this.addRandomTile();
            this.updateView();
        }
    },

    moveUp: function () {
        this.model.rotate();
        let didTilesChange = this.mergeRight();
        this.model.rotate();
        this.model.rotate();
        this.model.rotate();

        if (didTilesChange) {
            this.addRandomTile();
            this.updateView();
        }
    },

    moveLeft: function () {
        this.model.rotate();
        this.model.rotate();
        let didTilesChange = this.mergeRight();
        this.model.rotate();
        this.model.rotate();

        if (didTilesChange) {
            this.addRandomTile();
            this.updateView();
        }
    },

    moveDown: function () {
        this.model.rotate();
        this.model.rotate();
        this.model.rotate();
        let didTilesChange = this.mergeRight();
        this.model.rotate();

        if (didTilesChange) {
            this.addRandomTile();
            this.updateView();
        }
    },
});
