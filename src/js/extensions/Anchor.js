define(["./Button","../selection","../util"], function(Button, Selection, util){

    return Button.extend({

        // button definitions
        hasForm: true,
        action: 'createLink',
        aria: 'link',
        tagNames: ['a'],
        contentDefault: '<b>#</b>',
        contentFA: '<i class="fa fa-link"></i>',

        // properties
        inputPlaceholder: 'Paste or type a link',
        inputCheckboxLabel: 'Open in new window',
        validateLink: false,
        anchorTarget: false,
        anchorButton: false,
        anchorButtonClass: 'btn',

        // labels for the anchor-edit form buttons
        formSaveLabel: '&#10003;',
        formCloseLabel: '&times;',

        // Called when the button the toolbar is clicked
        handleClick: function (evt) {
            evt.preventDefault();
            evt.stopPropagation();

            var selectedParentElement = Selection.getSelectedParentElement(util.getSelectionRange(this.base.options.ownerDocument));
            if (selectedParentElement.tagName &&
                    selectedParentElement.tagName.toLowerCase() === 'a') {
                return this.base.execAction('unlink');
            }

            if (!this.isDisplayed()) {
                this.showForm();
            }

            return false;
        },

        // Called by medium-editor to append form to the toolbar
        getForm: function () {
            if (!this.form) {
                this.form = this.createForm();
            }
            return this.form;
        },

        getTemplate: function () {

            var template = [
                '<input type="text" class="medium-editor-toolbar-input" placeholder="', this.inputPlaceholder, '">'
            ];

            template.push(
                '<a href="#" class="medium-editor-toolbar-save">',
                this.base.options.buttonLabels === 'fontawesome' ? '<i class="fa fa-check"></i>' : this.formSaveLabel,
                '</a>'
            );

            template.push('<a href="#" class="medium-editor-toolbar-close">',
                this.base.options.buttonLabels === 'fontawesome' ? '<i class="fa fa-times"></i>' : this.formCloseLabel,
                '</a>');

            // both of these options are slightly moot with the ability to
            // override the various form buildup/serialize functions.

            if (this.anchorTarget) {
                // fixme: ideally, this options.anchorInputCheckboxLabel would be a formLabel too,
                // figure out how to deprecate? also consider `fa-` icon default implcations.
                template.push(
                    '<input type="checkbox" class="medium-editor-toolbar-anchor-target">',
                    '<label>',
                    this.inputCheckboxLabel,
                    '</label>'
                );
            }

            if (this.anchorButton) {
                // fixme: expose this `Button` text as a formLabel property, too
                // and provide similar access to a `fa-` icon default.
                template.push(
                    '<input type="checkbox" class="medium-editor-toolbar-anchor-button">',
                    '<label>Button</label>'
                );
            }

            return template.join("");

        },

        // Used by medium-editor when the default toolbar is to be displayed
        isDisplayed: function () {
            return this.getForm().style.display === 'block';
        },

        hideForm: function () {
            this.getForm().style.display = 'none';
            this.getInput().value = '';
        },

        showForm: function (link_value) {
            var input = this.getInput();

            this.base.saveSelection();
            this.base.hideToolbarDefaultActions();
            this.getForm().style.display = 'block';
            this.base.setToolbarPosition();

            input.value = link_value || '';
            input.focus();
        },

        // Called by core when tearing down medium-editor (deactivate)
        deactivate: function () {
            if (!this.form) {
                return false;
            }

            if (this.form.parentNode) {
                this.form.parentNode.removeChild(this.form);
            }

            delete this.form;
        },

        // core methods

        getFormOpts: function () {
            // no notion of private functions? wanted `_getFormOpts`
            var targetCheckbox = this.getForm().querySelector('.medium-editor-toolbar-anchor-target'),
                buttonCheckbox = this.getForm().querySelector('.medium-editor-toolbar-anchor-button'),
                opts = {
                    url: this.getInput().value
                };

            if (this.validateLinkFormat) {
                opts.url = this.checkLinkFormat(opts.url);
            }

            if (targetCheckbox && targetCheckbox.checked) {
                opts.target = "_blank";
            } else {
                opts.target = "_self";
            }

            if (buttonCheckbox && buttonCheckbox.checked) {
                opts.buttonClass = this.anchorButtonClass;
            }

            return opts;
        },

        doFormSave: function () {
            var opts = this.getFormOpts();
            this.completeFormSave(opts);
        },

        completeFormSave: function (opts) {
            this.base.restoreSelection();
            this.base.createLink(opts);
            this.base.checkSelection();
        },

        // ugh, the property is names this, too.
        checkLinkFormat: function (value) {
            var re = /^(https?|ftps?|rtmpt?):\/\/|mailto:/;
            return (re.test(value) ? '' : 'http://') + value;
        },

        doFormCancel: function () {
            this.base.restoreSelection();
            this.base.checkSelection();
        },

        // form creation and event handling

        attachFormEvents: function (form) {
            var close = form.querySelector(".medium-editor-toolbar-close"),
                save = form.querySelector(".medium-editor-toolbar-save"),
                input = form.querySelector(".medium-editor-toolbar-input");

            // Handle clicks on the form itself
            this.base.on(form, 'click', this.handleFormClick.bind(this));

            // Handle typing in the textbox
            this.base.on(input, 'keyup', this.handleTextboxKeyup.bind(this));

            // Handle close button clicks
            this.base.on(close, 'click', this.handleCloseClick.bind(this));

            // Handle save button clicks (capture)
            this.base.on(save, 'click', this.handleSaveClick.bind(this), true);

        },

        createForm: function () {
            var doc = this.base.options.ownerDocument,
                form = doc.createElement('div');

            // Anchor Form (div)
            form.className = 'medium-editor-toolbar-form';
            form.id = 'medium-editor-toolbar-form-anchor-' + this.base.id;
            form.innerHTML = this.getTemplate();
            this.attachFormEvents(form);

            return form;
        },

        getInput: function () {
            return this.getForm().querySelector('input.medium-editor-toolbar-input');
        },

        handleTextboxKeyup: function (event) {
            // For ENTER -> create the anchor
            if (event.keyCode === util.keyCode.ENTER) {
                event.preventDefault();
                this.doFormSave();
                return;
            }

            // For ESCAPE -> close the form
            if (event.keyCode === util.keyCode.ESCAPE) {
                event.preventDefault();
                this.doFormCancel();
            }
        },

        handleFormClick: function (event) {
            // make sure not to hide form when clicking inside the form
            event.stopPropagation();
        },

        handleSaveClick: function (event) {
            // Clicking Save -> create the anchor
            event.preventDefault();
            this.doFormSave();
        },

        handleCloseClick: function (event) {
            // Click Close -> close the form
            event.preventDefault();
            this.doFormCancel();
        }

    });

});