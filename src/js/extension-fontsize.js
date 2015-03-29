/*global Util, DefaultButton, AnchorExtension */

var FontSizeExtension;

(function () {
    'use strict';

    function FontSizeDerived() {
        this.parent = true;
        this.options = {
            name: 'fontsize',
            action: 'fontSize',
            aria: 'increase/decrease font size',
            contentDefault: '&#xB1;', // ±
            contentFA: '<i class="fa fa-text-height"></i>'
        };
        this.name = 'fontsize';
        this.hasForm = true;
    }

    FontSizeDerived.prototype = {

        // these are 100% c/p from AnchorExtension
        formSaveLabel: AnchorExtension.prototype.formSaveLabel,
        formCloseLabel: AnchorExtension.prototype.formCloseLabel,
        handleClick: AnchorExtension.prototype.handleClick,
        getForm: AnchorExtension.prototype.getForm,
        isDisplayed: AnchorExtension.prototype.isDisplayed,
        hideForm: AnchorExtension.prototype.hideForm,
        showForm: AnchorExtension.prototype.showForm,
        deactivate: AnchorExtension.prototype.deactivate,
        getInput: AnchorExtension.prototype.getInput,
        handleFormClick: AnchorExtension.prototype.handleFormClick,
        handleSaveClick: AnchorExtension.prototype.handleSaveClick,
        handleCloseClick: AnchorExtension.prototype.handleCloseClick,

        // core methods
        doFormSave: function () {
            this.base.restoreSelection();
            this.base.checkSelection();
        },

        doFormCancel: function () {
            this.base.restoreSelection();
            this.clearFontSize();
            this.base.checkSelection();
        },

        // form creation and event handling

        createForm: function () {
            var doc = this.base.options.ownerDocument,
                form = doc.createElement('div'),
                input = doc.createElement('input'),
                close = doc.createElement('a'),
                save = doc.createElement('a');

            // Font Size Form (div)
            form.className = 'medium-editor-toolbar-form';
            form.id = 'medium-editor-toolbar-form-fontsize-' + this.base.id;

            // Handle clicks on the form itself
            this.base.on(form, 'click', this.handleFormClick.bind(this));

            // Add font size slider
            input.setAttribute('type', 'range');
            input.setAttribute('min', '1');
            input.setAttribute('max', '7');
            input.className = 'medium-editor-toolbar-input';
            form.appendChild(input);

            // Handle typing in the textbox
            this.base.on(input, 'change', this.handleSliderChange.bind(this));

            // Add save buton
            save.setAttribute('href', '#');
            save.className = 'medium-editor-toobar-save';
            save.innerHTML = this.base.options.buttonLabels === 'fontawesome' ?
                             '<i class="fa fa-check"></i>' :
                             this.formSaveLabel;
            form.appendChild(save);

            // Handle save button clicks (capture)
            this.base.on(save, 'click', this.handleSaveClick.bind(this), true);

            // Add close button
            close.setAttribute('href', '#');
            close.className = 'medium-editor-toobar-close';
            close.innerHTML = this.base.options.buttonLabels === 'fontawesome' ?
                              '<i class="fa fa-times"></i>' :
                              this.formCloseLabel;
            form.appendChild(close);

            // Handle close button clicks
            this.base.on(close, 'click', this.handleCloseClick.bind(this));

            return form;
        },

        clearFontSize: function () {
            this.base.getSelectionEls().forEach(function (el) {
                if (el.tagName === 'FONT' && el.hasAttribute('size')) {
                    el.removeAttribute('size');
                }
            });
        },

        handleSliderChange: function () {
            var size = this.getInput().value;
            if (size === '4') {
                this.clearFontSize();
            } else {
                this.base.fontSize({size: size});
            }
        }

    };

    FontSizeExtension = Util.derives(DefaultButton, FontSizeDerived);
}());
