define([
    "../util",
    "./buttons",
    "./options",
    "./extensions",
    "./deprecated"
], function(
    util,
    buttonDefaults,
    optionDefaults,
    extensionDefaults,
    deprecatedDefaults
){

    // the helper function which takes all the known extensions and
    // options passed and creates and instantiates all the things
    // we need.

    return function byMagic(args){
        // args is a deep dict of properties.
        // what we want is a combination of `defaults` and `args`
        // that gives us a proper/normalized `options` dict we can
        // use everywhere.
        //
        // `defaultExtensions` is a list of built-in extensions.
        // the `defaults` for the matching name is the default properties
        // for that extension. anyting in `args` of that matching name
        // is an override.
        //
        // an override can be a number of things
        //  * false - do not enable this extension, local/default or anything
        //  * true - enable if off by default, nop if on by default.
        //  * object - options to pass along to the extension as ctor args
        //          mixed over the instance when instantiating initially
        //  * function - a ctor to use in place of the default, or as a custom
        //          extension.

        var options = util.extend({}, optionDefaults, args);

        this.commands = [];

        if("extensions" in options){
            // they passed an explicit "extensions" object, which
            // for backwards compat reasons is only a list of
            // instantiated things expecting decorated
            for(var i in options.extensions){
                options.extensions[i].base = this;
                if(!options.extensions[i].name){
                    options.extensions[i].name = i;
                }
                this.commands.push(options.extensions[i]);
            }
            // delete options.extensions;
        }

        // go through the args and see if they passed any that are
        // nondefault + deprecated
        for(var arg in args){
            if(arg in deprecatedDefaults){
                util.deprecated(arg, deprecatedDefaults[arg][1], "5.0.0", function(){
                    // attempt to set this to the new known location?
                });
            }
        }

        return options;
    };

});