(function (window, document) {

    /**
     * Loads and provides codecs from /codecs/ folder.
     * @constructor
     */
    CodesetSupplier = function () {
    };

    CodesetSupplier.prototype = {
        cached: {},

        get: function(setName, success, error){
            var self = this;
            if(this.cached.hasOwnProperty(setName)) {
                success(this.cached[setName]);
            }
            $.getJSON("codecs/" + setName + ".json", function (data){
                if(data == undefined || !data.hasOwnProperty('charSets')){
                    if(error != undefined && error != null){
                        error("Bad result");
                    }
                    return;
                }
                self.cached[setName] = data['charSets'];
                success(self.cached[setName]);
            });
        }
    };
})(window, document);
