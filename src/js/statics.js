define([
    "./defaults/buttons",
    "./extensions/Button",
    "./extensions/Anchor",
    "./extensions/Toolbar",
    "./extensions/AnchorPreview"
], function(
    ButtonsData,
    DefaultButton,
    AnchorExtension,
    Toolbar,
    AnchorPreview
){

    return {
        ButtonsData: ButtonsData,
        DefaultButton: DefaultButton,
        AnchorExtension: AnchorExtension,
        Toolbar: Toolbar,
        AnchorPreview: AnchorPreview
    };

});