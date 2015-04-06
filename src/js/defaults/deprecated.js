define([], function(){

    // deprecated default values. defaults have been preserved
    // as prototype props on the appropriate extension, this
    // is used to detect someone passing some non-default
    // value to the deprecated property, and setting that
    // property as an override for the extension ctor

    // each deprecated property is an array of three things.
    // original value, new location, new value
    //
    // new location is a dot.notation.accessed thing relative
    // to what kind of property would be expected to be passed
    // in instead.

    return {
        anchorInputPlaceholder: ['Paste or type a link', 'anchor.anchorInputPlaceholder'],
        anchorInputCheckboxLabel: ['Open in new window', 'anchor.anchorInputCheckboxLabel'],
        anchorPreviewHideDelay: [500, "anchor-preview.hideDelay"],
        checkLinkFormat: [false, "anchor.checkLinkFormat"],
        cleanPastedHTML: [false, "paste.cleanPastedHTML"],
        delay: [0, "toolbar.delay"],
        diffLeft: [0, "toolbar.diffLeft"],
        diffTop: [-10, "toolbar.diffTop"],
        disableToolbar: [false, "toolbar", false],
        disableAnchorPreview: [false, "anchor-preview", false],
        disablePlaceholders: [false, "placeholders", false],
        toolbarAlign: ['center', "toolbar.align"],
        forcePlainText: [true, "paste.forcePlainText"],
        placeholder: ['Type your text', "placeholders.placeholder"],
        targetBlank: [false, "anchor.targetBlank"],
        anchorTarget: [false, "anchor.anchorTarget"],
        anchorButton: [false, "anchor.anchorButton"],
        anchorButtonClass: ['btn', "anchor.anchorButtonClass"],
        activeButtonClass: ['medium-editor-button-active', 'toolbar.activeButtonClass'],
        firstButtonClass: ['medium-editor-button-first','toolbar.lastButtonClass'],
        lastButtonClass: ['medium-editor-button-last', 'toolbar.firstButtonClass'],
        firstHeader: ['h3', "headers.0", 'h3'],
        secondHeader: ['h4', "headers.1", 'h4'],
    };

});