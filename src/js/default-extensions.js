define([
    "./Extension",
    "./extensions/Anchor",
    "./extensions/AnchorPreview",
    "./extensions/Events",
    "./extensions/Placeholders",
    "./extensions/Paste",
    "./extensions/Toolbar"
], function(
    Extension,
    Anchor,
    AnchorPreview,
    Events,
    Placeholders,
    Paste,
    Toolbar
){

    return {
        // stubs, all the defaults and builtin `extensions`
        // listed here as uninstantiated ctors. editor will
        // new them up as needed
        "placeholders": Placeholders,
        "toolbar": Toolbar,
        "paste": Paste,
        "anchor": Anchor,
        "anchor-preview": AnchorPreview,
        "events": Events
    };

});