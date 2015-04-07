define([], function(){

    // core default options and extension activity. this is what remains of the deprecated
    // list and "move everything to extensions" concept.

    return {

        "placeholders": {},
        "toolbar": {},
        "anchor": {},
        "anchor-preview": {},
        "paste": {},
        "events": {},

        allowMultiParagraphSelection: true,

        // these are the by-default enabled toolbar buttons
        buttons: ['bold', 'italic', 'underline', 'anchor', 'header1', 'header2', 'quote'],

        // might consider implications of this, and provide a way away from
        // fa-bulk defaults?
        // buttonLabels: false,

        // is a base delay, not toolbar delay specifically
        delay: 0,

        //targetBlank: false,

        //disableReturn: false,
        //disableDoubleReturn: false,
        imageDragging: true,

        //elementsContainer: false,
        //standardizeSelectionStart: false,

        contentWindow: window,
        ownerDocument: document,

        // allow N headers
        headers:["h3","h4"]

    };

});
