define(["./util"], function(util){

    return function(protoProps){
        // magic extender thinger. mostly borrowed from backbone/goog.inherits
        // place this function on some thing you want extend-able.
        //
        // example:
        //
        //      function Thing(args){
        //          this.options = args;
        //      }
        //
        //      Thing.prototype = { foo: "bar" };
        //      Thing.extend = extenderify;
        //
        //      var ThingTwo = Thing.extend({ foo: "baz" });
        //
        //      var thingOne = new Thing(); // foo === bar
        //      var thingTwo = new ThingTwo(); // foo == baz
        //
        //      which seems like some simply shallow copy nonsense
        //      at first, but a lot more is going on there.
        //
        //
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

        // todo: $super?

        return child;
    };

});