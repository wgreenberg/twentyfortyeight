const Gtk = imports.gi.Gtk;
const Gdk = imports.gi.Gdk;
const Gio = imports.gi.Gio;
Gtk.init(null);

const BoardView = imports.views.boardView;
const BoardModel = imports.models.boardModel;
const BoardPresenter = imports.presenters.boardPresenter;

const TileModel = imports.models.tileModel;

let win = new Gtk.Window();
let boardView = new BoardView.BoardView({
    row_spacing: 20,
    column_spacing: 20,
});
let boardModel = new BoardModel.BoardModel();
let boardPresenter = new BoardPresenter.BoardPresenter({
    model: boardModel,
    view: boardView,
});

win.connect('key-press-event', (thing, event) => {
    let keyval = event.get_keyval()[1];
    let state = event.get_state()[1];

    switch (keyval) {
        case Gdk.KEY_Left:
            boardPresenter.moveLeft();
            break;
        case Gdk.KEY_Right:
            boardPresenter.moveRight();
            break;
        case Gdk.KEY_Up:
            boardPresenter.moveUp();
            break;
        case Gdk.KEY_Down:
            boardPresenter.moveDown();
            break;
    }
});

let provider = new Gtk.CssProvider();
let css_file = Gio.File.new_for_path('data/twentyfortyeight.css');
provider.load_from_file(css_file);
Gtk.StyleContext.add_provider_for_screen(Gdk.Screen.get_default(), provider, Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION);

boardPresenter.restart();
win.add(boardView);
win.show_all();
win.connect('destroy', Gtk.main_quit);
Gtk.main();
