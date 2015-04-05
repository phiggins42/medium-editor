define(["./util"], function(util){

    "use strict";

    var uniqueId = 1;

    return {

        createElementsArray: function(selector){
            if (!selector) {
                selector = [];
            }

            // If string, use as query selector
            if (typeof selector === 'string') {
                selector = this.options.ownerDocument.querySelectorAll(selector);
            }

            // If element, put into array
            if (util.isElement(selector)) {
                selector = [selector];
            }

            // Convert NodeList (or other array like object) into an array
            return Array.prototype.slice.apply(selector);
        },

        createContentEditable: function(){
            // todo: forward port @davi textarea fix
        },

        uniqueId: function(){
            while (this.options.elementsContainer.querySelector('#medium-editor-toolbar-' + uniqueId)) {
                uniqueId = uniqueId + 1;
            }
            return uniqueId;
        },

        execAction: function execActionInternal(action, opts) {
            /*jslint regexp: true*/
            var appendAction = /^append-(.+)$/gi,
                match;
            /*jslint regexp: false*/

            // Actions starting with 'append-' should attempt to format a block of text ('formatBlock') using a specific
            // type of block element (ie append-blockquote, append-h1, append-pre, etc.)
            match = appendAction.exec(action);
            if (match) {
                return util.execFormatBlock(this.options.ownerDocument, match[1]);
            }

            if (action === 'createLink') {
                return this.createLink(opts);
            }

            if (action === 'image') {
                return this.options.ownerDocument.execCommand('insertImage', false, this.options.contentWindow.getSelection());
            }

            return this.options.ownerDocument.execCommand(action, false, null);
        }

    };

});
