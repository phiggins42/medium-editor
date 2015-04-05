define([
    "./util",
    "./polyfills",
    "./extend",
    "./selection",
    "./defaults/combiner",
    "./core",
    "./extensions/Base"
], function(
    util,
    polyfills,
    extend,
    Selection,
    defaults,
    core,
    Extension
){

    "use strict";

    function Editor(/* elements, args */){
        // defer ctor to an init function
        this.init.apply(this, arguments);
    }

    Editor.version = (function(major, minor, revision) {
        return {
            major: parseInt(major, 10),
            minor: parseInt(minor, 10),
            revision: parseInt(revision, 10),
            toString: function(){
                return [major, minor, revision].join(".");
            }
        };
    }).apply(this, ({
        // grunt-bump looks for this:
        "version": "4.1.1"
    }).version.split("."));

    Editor.extend = extend;
    Editor.Extension = Extension;

    Editor.prototype = {

        init: function(elements, args){
            // summary: init the editor. elements are the nodes
            // we want to attach to, and args is our magic options
            // override hash

            this.options = defaults.call(this, args);
            this.elements = core.createElementsArray.call(this, elements);

            if(!this.elements.length){
                return;
            }

            if (!this.options.elementsContainer) {
                this.options.elementsContainer = this.options.ownerDocument.body;
            }

            this.id = core.uniqueId.call(this);
            this.setup();

        },

        setup: function(){
            if (this.isActive) {
                return;
            }

            this.isActive = true;

            core.initCommands.call(this);
            core.initElements.call(this);
            core.attachHandlers.call(this);

            // you can now use `this.base.options` in any of your extensions
            // and know that every key/value is a dot-accessible object, like
            // one big-ole' property map. all the ctors have been instantiated,
            // or decorated.
        }
    };

    return Editor;

});
