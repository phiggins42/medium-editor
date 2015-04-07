define(["./util","./selection"], function(util, Selection){

    "use strict";

    var uniqueId = 1;

    // Event handlers that shouldn't be exposed externally

    function handleDisabledEnterKeydown(event, element) {
        if (this.options.disableReturn || element.getAttribute('data-disable-return')) {
            event.preventDefault();
        } else if (this.options.disableDoubleReturn || this.getAttribute('data-disable-double-return')) {
            var node = util.getSelectionStart(this.options.ownerDocument);
            if (node && node.textContent.trim() === '') {
                event.preventDefault();
            }
        }
    }

    function handleTabKeydown(event) {
        // Override tab only for pre nodes
        var node = util.getSelectionStart(this.options.ownerDocument),
            tag = node && node.tagName.toLowerCase();

        if (tag === 'pre') {
            event.preventDefault();
            util.insertHTMLCommand(this.options.ownerDocument, '    ');
        }

        // Tab to indent list structures!
        if (util.isListItem(node)) {
            event.preventDefault();

            // If Shift is down, outdent, otherwise indent
            if (event.shiftKey) {
                this.options.ownerDocument.execCommand('outdent', false, null);
            } else {
                this.options.ownerDocument.execCommand('indent', false, null);
            }
        }
    }

    function handleBlockDeleteKeydowns(event) {
        var range, sel, p, node = util.getSelectionStart(this.options.ownerDocument),
            tagName = node.tagName.toLowerCase(),
            isEmpty = /^(\s+|<br\/?>)?$/i,
            isHeader = /h\d/i;

        if ((event.which === util.keyCode.BACKSPACE || event.which === util.keyCode.ENTER) &&
                // has a preceeding sibling
                node.previousElementSibling &&
                // in a header
                isHeader.test(tagName) &&
                // at the very end of the block
                Selection.getCaretOffsets(node).left === 0) {
            if (event.which === util.keyCode.BACKSPACE && isEmpty.test(node.previousElementSibling.innerHTML)) {
                // backspacing the begining of a header into an empty previous element will
                // change the tagName of the current node to prevent one
                // instead delete previous node and cancel the event.
                node.previousElementSibling.parentNode.removeChild(node.previousElementSibling);
                event.preventDefault();
            } else if (event.which === util.keyCode.ENTER) {
                // hitting return in the begining of a header will create empty header elements before the current one
                // instead, make "<p><br></p>" element, which are what happens if you hit return in an empty paragraph
                p = this.options.ownerDocument.createElement('p');
                p.innerHTML = '<br>';
                node.previousElementSibling.parentNode.insertBefore(p, node);
                event.preventDefault();
            }
        } else if (event.which === util.keyCode.DELETE &&
                    // between two sibling elements
                    node.nextElementSibling &&
                    node.previousElementSibling &&
                    // not in a header
                    !isHeader.test(tagName) &&
                    // in an empty tag
                    isEmpty.test(node.innerHTML) &&
                    // when the next tag *is* a header
                    isHeader.test(node.nextElementSibling.tagName)) {
            // hitting delete in an empty element preceding a header, ex:
            //  <p>[CURSOR]</p><h1>Header</h1>
            // Will cause the h1 to become a paragraph.
            // Instead, delete the paragraph node and move the cursor to the begining of the h1

            // remove node and move cursor to start of header
            range = this.options.ownerDocument.createRange();
            sel = this.options.ownerDocument.getSelection();

            range.setStart(node.nextElementSibling, 0);
            range.collapse(true);

            sel.removeAllRanges();
            sel.addRange(range);

            node.previousElementSibling.parentNode.removeChild(node);

            event.preventDefault();
        } else if (event.which === util.keyCode.BACKSPACE &&
                tagName === 'li' &&
                // hitting backspace inside an empty li
                isEmpty.test(node.innerHTML) &&
                // is first element (no preceeding siblings)
                !node.previousElementSibling &&
                // parent also does not have a sibling
                !node.parentElement.previousElementSibling &&
                // is not the only li in a list
                node.nextElementSibling.tagName.toLowerCase() === 'li') {
            // backspacing in an empty first list element in the first list (with more elements) ex:
            //  <ul><li>[CURSOR]</li><li>List Item 2</li></ul>
            // will remove the first <li> but add some extra element before (varies based on browser)
            // Instead, this will:
            // 1) remove the list element
            // 2) create a paragraph before the list
            // 3) move the cursor into the paragraph

            // create a paragraph before the list
            p = this.options.ownerDocument.createElement('p');
            p.innerHTML = '<br>';
            node.parentElement.parentElement.insertBefore(p, node.parentElement);

            // move the cursor into the new paragraph
            range = this.options.ownerDocument.createRange();
            sel = this.options.ownerDocument.getSelection();
            range.setStart(p, 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);

            // remove the list element
            node.parentElement.removeChild(node);

            event.preventDefault();
        }
    }

    function handleDrag(event) {
        var className = 'medium-editor-dragover';
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';

        if (event.type === 'dragover') {
            event.target.classList.add(className);
        } else if (event.type === 'dragleave') {
            event.target.classList.remove(className);
        }
    }

    function handleDrop(event) {
        var className = 'medium-editor-dragover',
            files;
        event.preventDefault();
        event.stopPropagation();

        // IE9 does not support the File API, so prevent file from opening in a new window
        // but also don't try to actually get the file
        if (event.dataTransfer.files) {
            files = Array.prototype.slice.call(event.dataTransfer.files, 0);
            files.some(function (file) {
                if (file.type.match("image")) {
                    var fileReader, id;
                    fileReader = new FileReader();
                    fileReader.readAsDataURL(file);

                    id = 'medium-img-' + (+new Date());
                    util.insertHTMLCommand(this.options.ownerDocument, '<img class="medium-image-loading" id="' + id + '" />');

                    fileReader.onload = function () {
                        var img = this.options.ownerDocument.getElementById(id);
                        if (img) {
                            img.removeAttribute('id');
                            img.removeAttribute('class');
                            img.src = fileReader.result;
                        }
                    }.bind(this);
                }
            }.bind(this));
        }
        event.target.classList.remove(className);
    }

    function handleKeyup(event) {
        var node = util.getSelectionStart(this.options.ownerDocument),
            tagName;

        if (!node) {
            return;
        }

        if (node.getAttribute('data-medium-element') && node.children.length === 0) {
            this.options.ownerDocument.execCommand('formatBlock', false, 'p');
        }

        if (event.which === util.keyCode.ENTER && !util.isListItem(node)) {
            tagName = node.tagName.toLowerCase();
            // For anchor tags, unlink
            if (tagName === 'a') {
                this.options.ownerDocument.execCommand('unlink', false, null);
            } else if (!event.shiftKey) {
                // only format block if this is not a header tag
                if (!/h\d/.test(tagName)) {
                    this.options.ownerDocument.execCommand('formatBlock', false, 'p');
                }
            }
        }
    }

    var core = {

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

            var every_disabled = true;

            for (var i = 0; i < this.elements.length; i += 1) {

                var current = this.elements[i];

                if (!this.options.disableEditing && !current.getAttribute('data-disable-editing')) {
                    if (current.tagName.toLowerCase() === 'textarea') {
                        current = this.elements[i] = core.createContentEditable.call(this, i);
                    }
                    current.setAttribute('contentEditable', true);
                }
                if (!current.getAttribute('data-placeholder')) {
                    current.setAttribute('data-placeholder', this.options.placeholder);
                }
                current.setAttribute('data-medium-element', true);
                current.setAttribute('role', 'textbox');
                current.setAttribute('aria-multiline', true);

                every_disabled = current.getAttribute("data-disable-toolbar") && every_disabled;
            }

            if(every_disabled){
                // this means we implicitly have set the anchor preview and toolbar options to false
                this.options["anchor-preview"] = this.options.toolbar = this.toolbar = false;
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
        },

        attachHandlers: function(){
            var i;

            // attach to tabs
            this.subscribe('editableKeydownTab', handleTabKeydown.bind(this));

            // Bind keys which can create or destroy a block element: backspace, delete, return
            this.subscribe('editableKeydownDelete', handleBlockDeleteKeydowns.bind(this));
            this.subscribe('editableKeydownEnter', handleBlockDeleteKeydowns.bind(this));

            // disabling return or double return
            if (this.options.disableReturn || this.options.disableDoubleReturn) {
                this.subscribe('editableKeydownEnter', handleDisabledEnterKeydown.bind(this));
            } else {
                for (i = 0; i < this.elements.length; i += 1) {
                    if (this.elements[i].getAttribute('data-disable-return') || this.elements[i].getAttribute('data-disable-double-return')) {
                        this.subscribe('editableKeydownEnter', handleDisabledEnterKeydown.bind(this));
                        break;
                    }
                }
            }

            // if we're not disabling return, add a handler to help handle cleanup
            // for certain cases when enter is pressed
            if (!this.options.disableReturn) {
                this.elements.forEach(function (element) {
                    if (!element.getAttribute('data-disable-return')) {
                        this.on(element, 'keyup', handleKeyup.bind(this));
                    }
                }, this);
            }

            // drag and drop of images
            if (this.options.imageDragging) {
                this.subscribe('editableDrag', handleDrag.bind(this));
                this.subscribe('editableDrop', handleDrop.bind(this));
            }
        }

    };

    return core;

});
