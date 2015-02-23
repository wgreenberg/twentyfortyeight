const GObject = imports.gi.GObject;
const Lang = imports.lang;

const BoardPresenter = imports.presenters.boardPresenter;

const MockModel = Lang.Class({
    Name: 'MockModel',
    GTypeName: 'MockModel',
    Extends: GObject.Object,

    _init: function (props) {
        this.parent(props);
        this.rotate = jasmine.createSpy('rotate');
        this.packRight = jasmine.createSpy('packRight');
        this.remove = jasmine.createSpy('remove');
    },
});

const MockView = Lang.Class({
    Name: 'MockView',
    GTypeName: 'MockView',
    Extends: GObject.Object,

    _init: function (props) {
        this.parent(props);
    },
});

const MockTile = Lang.Class({
    Name: 'MockTile',
    GTypeName: 'MockTile',
    Extends: GObject.Object,

    _init: function (value) {
        this.parent();
        this.double = jasmine.createSpy('double');
        this.value = value;
    },
});

describe('BoardPresenter', function () {
    let board, mockModel, mockView;
    beforeEach(function () {
        mockModel = new MockModel();
        mockView = new MockView();
        board = new BoardPresenter.BoardPresenter({
            model: mockModel,
            view: mockView,
        });
    });

    it('should be constructable', function () {
        expect(board).toBeDefined();
    });

    describe('mergeRight', function () {
        it('should handle a basic merge', function () {
            let tile1 = new MockTile(2);
            let tile2 = new MockTile(2);
            mockModel.tiles = [
                {
                    row: 0,
                    col: 0,
                    tile: tile1,
                },
                {
                    row: 0,
                    col: 1,
                    tile: tile2,
                },
            ];

            board.mergeRight();
            expect(mockModel.remove).toHaveBeenCalledWith(0, 1);
            expect(tile1.double).toHaveBeenCalled();
            expect(tile2.double).not.toHaveBeenCalled();
            expect(mockModel.packRight).toHaveBeenCalled();
        });

        it('should not merge when values are not equal', function () {
            let tile1 = new MockTile(2);
            let tile2 = new MockTile(4);
            mockModel.tiles = [
                {
                    row: 0,
                    col: 0,
                    tile: tile1,
                },
                {
                    row: 0,
                    col: 1,
                    tile: tile2,
                },
            ];

            board.mergeRight();
            expect(mockModel.remove).not.toHaveBeenCalled();
            expect(tile1.double).not.toHaveBeenCalled();
            expect(tile2.double).not.toHaveBeenCalled();
            expect(mockModel.packRight).toHaveBeenCalled();
        });

        it('should not merge in a cascading fashion', function () {
            // e.g. [2, 2, 4] => [4, 4]
            //      instead of [8]
            let tile1 = new MockTile(2);
            let tile2 = new MockTile(2);
            let tile3 = new MockTile(4);
            mockModel.tiles = [
                {
                    row: 0,
                    col: 0,
                    tile: tile1,
                },
                {
                    row: 0,
                    col: 1,
                    tile: tile2,
                },
                {
                    row: 0,
                    col: 2,
                    tile: tile3,
                },
            ];

            board.mergeRight();
            expect(mockModel.remove).toHaveBeenCalledWith(0, 1);
            expect(tile1.double).toHaveBeenCalled();
            expect(tile1.double.calls.count()).toEqual(1);
            expect(tile2.double).not.toHaveBeenCalled();
            expect(tile3.double).not.toHaveBeenCalled();
            expect(mockModel.packRight).toHaveBeenCalled();
        });

        it('should handle triples', function () {
            // e.g. [2, 2, 2] => [2, 4]
            //      instead of [4, 2]
            let tile1 = new MockTile(2);
            let tile2 = new MockTile(2);
            let tile3 = new MockTile(2);
            mockModel.tiles = [
                {
                    row: 0,
                    col: 0,
                    tile: tile1,
                },
                {
                    row: 0,
                    col: 1,
                    tile: tile2,
                },
                {
                    row: 0,
                    col: 2,
                    tile: tile3,
                },
            ];

            board.mergeRight();
            expect(mockModel.remove).toHaveBeenCalledWith(0, 2);
            expect(tile1.double).not.toHaveBeenCalled();
            expect(tile2.double).toHaveBeenCalled();
            expect(tile2.double.calls.count()).toEqual(1);
            expect(tile3.double).not.toHaveBeenCalled();
            expect(mockModel.packRight).toHaveBeenCalled();
        });
    });

    describe('moves', function () {
        beforeEach(function () {
            spyOn(board, 'mergeRight').and.returnValue(true);
            spyOn(board, 'addRandomTile');
        });
        it('should mergeRight on Right moves', function () {
            board.model.tiles = []
            board.moveRight();
            expect(board.mergeRight).toHaveBeenCalled();
            expect(board.addRandomTile).toHaveBeenCalled();
            expect(board.view.tiles).toBe(mockModel.tiles);
        });
        it('should rotate four times and mergeRight on Up moves', function () {
            board.model.tiles = []
            board.moveUp();
            expect(mockModel.rotate).toHaveBeenCalled();
            expect(mockModel.rotate.calls.count()).toEqual(4);
            expect(board.mergeRight).toHaveBeenCalled();
            expect(board.addRandomTile).toHaveBeenCalled();
            expect(board.view.tiles).toBe(mockModel.tiles);
        });
        it('should rotate four times and mergeRight on Left moves', function () {
            board.model.tiles = []
            board.moveLeft();
            expect(mockModel.rotate).toHaveBeenCalled();
            expect(mockModel.rotate.calls.count()).toEqual(4);
            expect(board.mergeRight).toHaveBeenCalled();
            expect(board.addRandomTile).toHaveBeenCalled();
            expect(board.view.tiles).toBe(mockModel.tiles);
        });
        it('should rotate four times and mergeRight on Down moves', function () {
            board.model.tiles = []
            board.moveDown();
            expect(mockModel.rotate).toHaveBeenCalled();
            expect(mockModel.rotate.calls.count()).toEqual(4);
            expect(board.mergeRight).toHaveBeenCalled();
            expect(board.addRandomTile).toHaveBeenCalled();
            expect(board.view.tiles).toBe(mockModel.tiles);
        });

        it('should not call addRandomTile if mergeRight returns false', function () {
            board.mergeRight.and.returnValue(false);
            board.moveDown();
            expect(board.mergeRight).toHaveBeenCalled();
            expect(board.addRandomTile).not.toHaveBeenCalled();
        });
    });
});
