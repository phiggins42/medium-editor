define(["../util","../extend"], function(util, extend){

    function BaseExtension(options){
        util.extend(this, options);
    }

    BaseExtension.extend = extend;
    BaseExtension.prototype = {
        init: function(){
            //
        }
        // core API definition
    };

    return BaseExtension;

});