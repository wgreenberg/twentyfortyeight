const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Lang = imports.lang;

GObject.ParamFlags.READWRITE = GObject.ParamFlags.READABLE | GObject.ParamFlags.WRITABLE;

const NUM_ROWS = 4;
const NUM_COLS = 4;

const BoardModel = Lang.Class({
    Name: 'BoardModel',
    GTypeName: 'BoardModel',
    Extends: GObject.Object,

    Properties: {
    },

    _init: function (props) {
        this.parent(props);
        this._tiles = {};
    },

    clear: function () {
        this._tiles = {};
    },

    get empty () {
        let usedTiles = Object.keys(this._tiles);
        let unusedTiles = [];
        for (let i = 0; i < NUM_ROWS; i++) {
            for (let j = 0; j < NUM_COLS; j++) {
                let possibleTile = this._serialize(i, j);
                if (usedTiles.indexOf(possibleTile) === -1) {
                    let [row, col] = this._deserialize(possibleTile);
                    unusedTiles.push({
                        row: row,
                        col: col,
                    });
                }
            }
        }

        return unusedTiles
    },

    get tiles () {
        let ids = Object.keys(this._tiles);
        return ids.map((id) => {
            let [row, col] = this._deserialize(id);
            return {
                row: row,
                col: col,
                tile: this._tiles[id],
            };
        });
    },

    add: function (tile, rownum, colnum) {
        let id = this._serialize(rownum, colnum);
        if (!this._isValidCoordinate(rownum, colnum)) {
            throw 'Coordinate out of range: ' + rownum + ', ' + colnum;
        }
        if (this._tiles.hasOwnProperty(id)) {
            throw 'Tile at ' + rownum + ', ' + colnum + ' exists!';
        }
        this._tiles[id] = tile;
    },

    // rotates the board clockwise by 90 degrees
    rotate: function () {
        this._transpose();
        this._flipRows();
    },

    _flipRows: function () {
        let ids = Object.keys(this._tiles);
        let flipped = ids.reduce((newTiles, id) => {
            let [row, col] = this._deserialize(id);
            let swappedId = this._serialize(row, NUM_COLS - col - 1);

            newTiles[swappedId] = this._tiles[id];
            return newTiles;
        }, {});

        this._tiles = flipped;
    },

    remove: function (rownum, colnum) {
        let idToRemove = this._serialize(rownum, colnum);
        if (!this._tiles.hasOwnProperty(idToRemove)) {
            throw 'Cannot remove tile at ' + rownum + ', ' + colnum;
        }

        delete this._tiles[idToRemove];
    },

    _transpose: function () {
        let ids = Object.keys(this._tiles);
        let transposed = ids.reduce((newTiles, id) => {
            let [row, col] = this._deserialize(id);
            // swap row/col to transpose
            let swappedId = this._serialize(col, row);

            newTiles[swappedId] = this._tiles[id];
            return newTiles;
        }, {});

        this._tiles = transposed;
    },

    packRight: function () {
        let sparseTileGrid = this.tiles.reduce((grid, tile) => {
            if (grid[tile.row] === undefined)
                grid[tile.row] = [];
            grid[tile.row][tile.col] = tile;
            return grid;
        }, {})
        let compactTileGrid = Object.keys(sparseTileGrid).reduce((grid, row) => {
            let sparseRow = sparseTileGrid[row];
            let compactRow = sparseRow.filter((value) => value !== undefined);
            compactRow.reverse().map((tile, index) => {
                let compactId = this._serialize(row, NUM_COLS - index - 1);
                grid[compactId] = tile.tile;
            });
            return grid;
        }, {});
        this._tiles = compactTileGrid;
    },

    _isValidCoordinate: function (rownum, colnum) {
        return (rownum >= 0 && rownum < NUM_ROWS)
            && (colnum >= 0 && colnum < NUM_COLS);
    },

    _serialize: function (rownum, colnum) {
        return rownum + ',' + colnum;
    },

    _deserialize: function (id) {
        return id.split(',').map((str) => parseInt(str));
    },
});
