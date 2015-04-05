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

        createContentEditable: function(index){
            // todo: forward port @davi textarea fix
        },

        uniqueId: function(){
            while (this.options.elementsContainer.querySelector('#medium-editor-toolbar-' + uniqueId)) {
                uniqueId = uniqueId + 1;
            }
            return uniqueId;
        }

    };

});
