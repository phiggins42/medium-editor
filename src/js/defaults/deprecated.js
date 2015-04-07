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
    // in instead. presence of a newvalue overrides passed value

    return {

        anchorInputPlaceholder: ['Paste or type a link', 'anchor.inputPlaceholder'],
        anchorInputCheckboxLabel: ['Open in new window', 'anchor.inputCheckboxLabel'],
        anchorTarget: [false, "anchor.anchorTarget"],
        anchorButton: [false, "anchor.anchorButton"],
        anchorButtonClass: ['btn', "anchor.anchorButtonClass"],
        checkLinkFormat: [false, "anchor.validateLink"],

        cleanPastedHTML: [false, "paste.cleanPastedHTML"],
        forcePlainText: [true, "paste.forcePlainText"],

        diffLeft: [0, "toolbar.diffLeft"],
        diffTop: [-10, "toolbar.diffTop"],
        activeButtonClass: ['medium-editor-button-active', 'toolbar.activeButtonClass'],
        firstButtonClass: ['medium-editor-button-first','toolbar.firstButtonClass'],
        lastButtonClass: ['medium-editor-button-last', 'toolbar.lastButtonClass'],

        disableToolbar: [false, "toolbar", false],
        toolbarAlign: ['center', "toolbar.align"],

        anchorPreviewHideDelay: [500, "anchor-preview.hideDelay"],
        disableAnchorPreview: [false, "anchor-preview", false],

        disablePlaceholders: [false, "placeholders", false],

        placeholder: ['Type your text', "placeholders.placeholder"],

        firstHeader: ['h3', "headers.0"],
        secondHeader: ['h4', "headers.1"]

    };

});