define(["./util"], function(util){

    "use strict";

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
            if (Util.isElement(selector)) {
                selector = [selector];
            }

            // Convert NodeList (or other array like object) into an array
            return Array.prototype.slice.apply(selector);
        }



    };

});