const BoardModel = imports.models.boardModel;

describe('BoardModel', function () {
    let board;
    beforeEach(function () {
        board = new BoardModel.BoardModel();
    });

    it('should be constructable', function () {
        expect(board).toBeDefined();
    });

    it('start with no tiles', function () {
        expect(board.tiles).toEqual([]);
    });
    
    it('should allow tiles to be added', function () {
        let mockTile = "I'm a tile!";
        board.add(mockTile, 1, 1);
        expect(board.tiles.length).toEqual(1);
        expect(board.tiles[0]).toEqual({
            row: 1,
            col: 1,
            tile: mockTile,
        });
    });

    it('should allow tiles to be removed', function () {
        let mockTile = "I'm a tile!";
        board.add(mockTile, 1, 1);
        expect(board.tiles.length).toEqual(1);
        board.remove(1, 1);
        expect(board.tiles.length).toEqual(0);
    });

    it('should complain if removed tile does not exist', function () {
        expect(() => board.remove(1, 1)).toThrow();
    });

    it('should have a clear function', function () {
        let mockTile = "I'm a tile!";
        board.add(mockTile, 1, 1);
        board.clear();
        expect(board.tiles.length).toEqual(0);
    });

    it('should not allow tiles to be added out of bounds', function () {
        expect(() => {
            board.add('foo', 100, 0);
        }).toThrow();
        expect(() => {
            board.add('foo', 0, 100);
        }).toThrow();
        expect(() => {
            board.add('foo', -1, 3);
        }).toThrow();
        expect(() => {
            board.add('foo', 3, -1);
        }).toThrow();
    });

    it('should not allow tiles to be overwritten', function () {
        let mockTile = "I'm a tile!";
        board.add(mockTile, 1, 1);
        expect(() => board.add(mockTile, 1, 1)).toThrow();
    });

    it('should perform board rotations', function () {
        let topLeftTile = "I'm in the top left!";
        board.add(topLeftTile, 0, 0);
        let topRightTile = "I'm in the top right!";
        board.add(topRightTile, 0, 3);
        board.rotate();
        expect(board.tiles).toEqual([
            {
                row: 0,
                col: 3,
                tile: topLeftTile,
            },
            {
                row: 3,
                col: 3,
                tile: topRightTile,
            },
        ]);
        board.rotate();
        expect(board.tiles).toEqual([
            {
                row: 3,
                col: 3,
                tile: topLeftTile,
            },
            {
                row: 3,
                col: 0,
                tile: topRightTile,
            },
        ]);
    });

    it('should return a list of unused row/col pairs', function () {
        expect(board.unusedTiles.length).toEqual(16);
        let topLeftTile = "I'm in the top left!";
        board.add(topLeftTile, 2, 3);
        expect(board.unusedTiles.length).toEqual(15);
        expect(board.unusedTiles).not.toContain({
            row: 2,
            col: 3,
        });
    });

    it('should perform packing in the rightward direction', function () {
        let topLeftTile = "I'm in the top left!";
        board.add(topLeftTile, 0, 0);
        let topRightishTile = "I'm almost in the top right!";
        board.add(topRightishTile, 0, 2);
        let botLeftTile = "I'm at the bottom left!"
        board.add(botLeftTile, 3, 0);
        board.packRight();
        expect(board.tiles).toContain({
            row: 0,
            col: 2,
            tile: topLeftTile,
        });
        expect(board.tiles).toContain({
            row: 0,
            col: 3,
            tile: topRightishTile,
        });
        expect(board.tiles).toContain({
            row: 3,
            col: 3,
            tile: botLeftTile,
        });
    });
});
