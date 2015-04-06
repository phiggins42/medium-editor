define([
    "../util",
    "./buttons",
    "./options",
    "./extensions",
    "./deprecated",
    "../extensions/Button"
], function(
    util,
    buttonDefaults,
    optionDefaults,
    extensionDefaults,
    deprecatedDefaults,
    Button
){

    // the helper function which takes all the known extensions and
    // options passed and creates and instantiates all the things
    // we need.

    function create(Ctor, props, name, base){
        // ctor: Function - something to instantiate
        // props: Object - mixed in as ctor arguments
        // name: String - the name of the extension
        // base: Object - the "owner" of the object
        var thing = new Ctor(props);
        return decorate(thing, name, base);
    }

    function decorate(instance, name, base){
        // do the base/name decoration to some instance
        instance.base = base;
        if(!instance.name){ instance.name = name; }
        return instance;
    }

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
        var ctors = util.extend({}, extensionDefaults);
        var extensions = options.extensions;

        if(extensions){
            // they passed an explicit "extensions" object, which
            // for backwards compat reasons is only a list of
            // instantiated things expecting decorated
            for(var i in extensions){
                this.commands.push(decorate(extensions[i], i, this));
            }
        }else{
            extensions = options.extensions = {};
        }

        // go through the args and see if they passed any that are
        // nondefault + deprecated
        for(var arg in args){
            if(arg in deprecatedDefaults && deprecatedDefaults[arg][0] !== args[arg]){

                var newVal = args[arg],
                    newPath = deprecatedDefaults[arg][1]
                ;

                util.deprecated("options." + arg, "options." + newPath, "5.0");
                util.setObject(newPath, newVal, options);
            }
        }

        // ensure we have an .extension for every button
        options.buttons.forEach(function(button){
            if ( button in extensions ) {
                // there is an explicit extension override for this button
                // and will have already been instantiated
                // extensions[button];
            } else if ( button in buttonDefaults ){
                // this is a stock button type. just new a defaultButton
                // with the override props that define the button behavior
                extensions[button] = create(Button, buttonDefaults[button], button, this);
            } else if ( button in ctors ){
                // this is a default-extension with no override
                extensions[button] = create(ctors[button], {}, button, this);
            }

        }, this);

        for (var opt in options) {
            // now walk over the settings object to see if anyone passed anything
            // magic to the properties. defaults are true for all the ctors we
            // default to, so instantiate them now if found.
            var current = options[opt];
            // if a key exists in ctors it is for that feature.
            if ( opt in ctors ) {

                if ( typeof current === "function" ){
                    // it is expected to be an overriden ctor
                    extensions[opt] = create(current, {}, opt, this);
                } else if ( current === true ) {
                    // true just means default ctor is to be enabled
                    extensions[opt] = create(ctors[opt], {}, opt, this);
                } else if ( typeof current === "object" ) {
                    extensions[opt] = create(ctors[opt], current, opt, this);
                }

                // this is a bit of magic. toolbars and events and things
                // are instantiated and used locally.
                if( opt in this ){
                    util.warn("cowardly not overwriting core property:", opt);
                }else {
                    this[opt] = extensions[opt];
                }

            }
        }

        return options;
    };

});