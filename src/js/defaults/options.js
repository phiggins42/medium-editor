define([], function(){

    // core default options and extension activity

    return {

        "placeholders": true,
        "toolbar": true,
        "anchor": true,
        "anchor-preview": true,
        "paste": true,
        "events": true,

        allowMultiParagraphSelection: true,

        // these are the by-default enabled toolbar buttons
        buttons: ['bold', 'italic', 'underline', 'anchor', 'header1', 'header2', 'quote'],

        // might consider implications of this, and provide a way away from
        // fa-bulk defaults?
        buttonLabels: false,

        disableReturn: false,
        disableDoubleReturn: false,
        imageDragging: true,
        elementsContainer: false,
        standardizeSelectionStart: false,
        contentWindow: window,
        ownerDocument: document,

        // allow N headers
        headers:["h3","h4"]

    };

});
