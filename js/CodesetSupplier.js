(function (window, document) {

    const CODEC_MODE_TO_UPPER = 1;
    const CODEC_MIN_SET_LENGTH = 1;

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
