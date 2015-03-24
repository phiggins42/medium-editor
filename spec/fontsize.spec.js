/*global MediumEditor, describe, it, expect, spyOn,
     afterEach, beforeEach, selectElementContents,
     jasmine, fireEvent, console, tearDown,
     selectElementContentsAndFire, xit */

fdescribe('Font Size Button TestCase', function () {
    'use strict';

    beforeEach(function () {
        jasmine.clock().install();
        this.mediumOpts = {buttons: ['fontsize']};
        this.el = document.createElement('div');
        this.el.className = 'editor';
        this.el.innerHTML = 'lorem ipsum';
        document.body.appendChild(this.el);
    });

    afterEach(function () {
        tearDown(this.el);
        jasmine.clock().uninstall();
    });

    describe('Click', function () {
        it('should display the font size form when toolbar is visible', function () {
            spyOn(MediumEditor.statics.FontSizeExtension.prototype, 'showForm').and.callThrough();
            var button,
                editor = new MediumEditor('.editor', this.mediumOpts),
                fontSizeExtension = editor.getExtensionByName('fontsize');
            selectElementContentsAndFire(editor.elements[0]);
            jasmine.clock().tick(1);
            button = editor.toolbar.getToolbarElement().querySelector('[data-action="fontSize"]');
            fireEvent(button, 'click');
            expect(editor.toolbar.getToolbarActionsElement().style.display).toBe('none');
            expect(fontSizeExtension.isDisplayed()).toBe(true);
            expect(fontSizeExtension.showForm).toHaveBeenCalled();
        });
    });

    describe('Font Size', function () {
        it('should change font size when slider is moved', function () {
            spyOn(MediumEditor.prototype, 'fontSize').and.callThrough();
            var editor = new MediumEditor('.editor', this.mediumOpts),
                button,
                input;

            selectElementContents(editor.elements[0]);
            button = editor.toolbar.getToolbarElement().querySelector('[data-action="fontSize"]');
            fireEvent(button, 'click');
            input = editor.getExtensionByName('fontsize').getInput();
            input.value = '7';
            fireEvent(input, 'change');
            expect(editor.fontSize).toHaveBeenCalled();
            expect(this.el.innerHTML).toBe('<font size="7">lorem ipsum</font>');
        });
        it('should revert font size when slider value is set to 4', function () {
            spyOn(MediumEditor.prototype, 'fontSize').and.callThrough();
            spyOn(MediumEditor.statics.FontSizeExtension.prototype, 'clearFontSize').and.callThrough();
            var editor = new MediumEditor('.editor', this.mediumOpts),
                fontSizeExtension = editor.getExtensionByName('fontsize'),
                button,
                input;

            selectElementContents(editor.elements[0]);
            button = editor.toolbar.getToolbarElement().querySelector('[data-action="fontSize"]');
            fireEvent(button, 'click');
            input = fontSizeExtension.getInput();
            input.value = '7';
            fireEvent(input, 'change');
            expect(editor.fontSize).toHaveBeenCalled();
            input.value = '4';
            fireEvent(input, 'change');
            expect(this.el.innerHTML).toBe('lorem ipsum');
            expect(fontSizeExtension.clearFontSize).toHaveBeenCalled();
        });
    });

    describe('Cancel', function () {
        it('should close the font size form when user clicks on cancel', function () {
            spyOn(MediumEditor.statics.Toolbar.prototype, 'showAndUpdateToolbar').and.callThrough();
            var editor = new MediumEditor('.editor', this.mediumOpts),
                fontSizeExtension = editor.getExtensionByName('fontsize'),
                button,
                input,
                cancel;

            selectElementContents(editor.elements[0]);
            button = editor.toolbar.getToolbarElement().querySelector('[data-action="fontSize"]');
            cancel = fontSizeExtension.getForm().querySelector('a.medium-editor-toobar-close');
            fireEvent(button, 'click');
            expect(fontSizeExtension.isDisplayed()).toBe(true);
            input = editor.getExtensionByName('fontsize').getInput();
            input.value = '7';
            fireEvent(input, 'change');
            fireEvent(cancel, 'click');
            expect(this.el.innerHTML).toBe('lorem ipsum');
            expect(input.value).toBe('4');
            expect(editor.toolbar.showAndUpdateToolbar).toHaveBeenCalled();
            expect(fontSizeExtension.isDisplayed()).toBe(false);
        });
    });
});
