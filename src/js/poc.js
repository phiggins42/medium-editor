
// testing:

new Editor(".foo"); // all defaults
new Editor(".foo", {}); // all defaults

new Editor(".foo", {

    paste: defaultExtensions.paste.extend({
        // replaces the `paste` extension with override
    }),

    anchor: {
        // overrides ctor args for default extension
    },

    // disables the placeholders extension
    placeholders: false,

    // register a non-button extension
    custom_extension: new Extension({ a: 10 }),

    custom_extension_two: Extension.extend({
        a: 15
    }),

    // register a button extensions
    custom_button = new Extension({ a: 20 }),

    buttons:["custom_buttom"]

});









