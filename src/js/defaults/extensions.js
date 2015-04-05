define([
    "../extensions/Anchor",
    "../extensions/AnchorPreview",
    "../extensions/Events",
    "../extensions/Placeholders",
    "../extensions/Toolbar",
    "../extensions/Paste"
], function(
    Anchor,
    AnchorPreview,
    Events,
    Paste,
    Placeholders,
    Toolbar
){

    return {
        // stubs, all the defaults and builtin `extensions`
        // listed here as uninstantiated ctors. editor will
        // new them up as needed
        "anchor": Anchor,
        "anchor-preview": AnchorPreview,
        "events": Events,
        "placeholders": Placeholders,
        "paste": Paste,
        "toolbar": Toolbar
    };

});