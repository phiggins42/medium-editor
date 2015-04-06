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
        },

        initElements: function() {

            for (var i = 0; i < this.elements.length; i += 1) {

                var current = this.elements[i];

                if (!this.options.disableEditing && !current.getAttribute('data-disable-editing')) {
                    if (current.tagName.toLowerCase() === 'textarea') {
                        current = this.elements[i] = this.createContentEditable.call(this, i);
                    }
                    current.setAttribute('contentEditable', true);
                }
                if (!current.getAttribute('data-placeholder')) {
                    current.setAttribute('data-placeholder', this.options.placeholder);
                }
                current.setAttribute('data-medium-element', true);
                current.setAttribute('role', 'textbox');
                current.setAttribute('aria-multiline', true);
            }


            if(this.toolbar){
                this.options.elementsContainer.appendChild(this.toolbar.getToolbarElement());
            }

        },

        createContentEditable: function(index) {
            var div = this.options.ownerDocument.createElement('div');
            var id = +(new Date());
            var textarea;
            div.innerHTML = this.elements[index].value;
            div.setAttribute('data-textarea', id);
            this.elements[index].classList.add('medium-editor-hidden');
            this.elements[index].setAttribute('data-textarea', id);
            this.elements[index].parentNode.insertBefore(
                div,
                this.elements[index]
            );
            textarea = this.options.ownerDocument.querySelectorAll('textarea[data-textarea="' + id + '"]')[0];
            this.on(div, 'input', function (e) {
                textarea.value = e.target.innerHTML;
            }.bind(this));
            return div;
        }

    };

});
