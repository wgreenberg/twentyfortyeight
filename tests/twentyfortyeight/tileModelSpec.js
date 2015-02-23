const TileModel = imports.models.tileModel;

describe('TileModel', function () {
    let tile;
    beforeEach(function () {
        tile = new TileModel.TileModel();
    });

    it('should be constructable', function () {
        expect(tile).toBeDefined();
    });

    it('should have a default value of 2', function () {
        expect(tile.value).toEqual(2);
    });

    it('should expose a double method', function () {
        tile.double();
        expect(tile.value).toEqual(4);
        tile.double();
        expect(tile.value).toEqual(8);
        tile.double();
        expect(tile.value).toEqual(16);
    });
});
