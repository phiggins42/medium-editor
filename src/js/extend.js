define(["./util"], function(util){

    return function(opts){
        // magic extender
        var parent = this, child;

        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call the parent's constructor.

        if (protoProps && protoProps.hasOwnProperty("constructor")) {
            child = protoProps.constructor;
        } else {
            child = function () { return parent.apply(this, arguments); };
        }

        // das statics
        util.extend(child, parent);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        var Surrogate = function(){ this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate();

        if (protoProps) { util.extend(child.prototype, protoProps); }

        return child;
    };

});