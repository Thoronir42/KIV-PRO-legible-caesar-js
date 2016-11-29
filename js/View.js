(function (window, document) {

    View = function (rootSelector) {
        this.$root = $(rootSelector);
        this.init();
    };

    View.prototype = {
        $root: null,

        $buttons: {
            encode: null,
            encodeRandom: null,
            decode: null,
            reset: null
        },
        $fields: {
            plainText: null,
            cipherText: null,
            keys: null,
            choices: null
        },
        $footers: {
            general: null,
            encode: null,
            progress: null
        },

        codecs: [],
        codecTpl: "",
        $codecs: null,
        $codecInputs: null,

        $alerts: null,
        alerts: {},
        alertTpl: "",

        $progressBar: null,


        init: function () {
            var $root = this.$root;

            this.$buttons.encode = $root.find("button[name=general-encode]");
            this.$buttons.encodeRandom = $root.find("button[name=general-encode-random]");
            this.$buttons.decode = $root.find("button[name=general-decode]");
            this.$buttons.reset = $root.find("button[name=reset]");

            this.$fields.plainText = $root.find("textarea[name=plain-text]");
            this.$fields.cipherText = $root.find("textarea[name=cipher-text]");
            this.$fields.keys = $root.find("textarea[name=keys]");
            this.$fields.choices = $root.find(".field-ciphers");

            this.$footers.general = $root.find(".controls-general");
            this.$footers.encode = $root.find(".controls-encode");
            this.$footers.progress = $root.find(".controls-progress");

            this.$codecs = $root.find(".codecs-wrapper");
            this.codecTpl = this.$codecs.html();

            this.$alerts = $root.find('.footer-alerts');
            this.alertTpl = this.$alerts.html();

            this.$progressBar = $root.find('.progress-bar');

            this.showControls('general');
            this.printAlerts();
        },

        setChoices: function (choices) {
            var html = "";
            for (var i in choices) {
                html += "<span class='label label-default' data-offset='" + i + "'>" + choices[i] + "</span> ";
            }
            this.$fields.choices.html(html);
        },

        updateFields: function (input, output, keys) {
            this.$fields.plainText.val(input.join(' '));
            this.$fields.cipherText.val(output.join(' '));
            this.$fields.keys.val(keys.join(' '));
        },
        showControls: function (id) {
            var $show;
            if (!this.$footers.hasOwnProperty(id)) {
                console.error("Wrong controls identificator: " + id);
                return;
            }

            $show = this.$footers[id];

            $show.siblings().hide();
            $show.show();
        },
        setCodecs: function (codecs) {
            this.codecs = codecs;
            var html = "";

            for (var i in codecs) {
                var codec = codecs[i];
                var tpl = this.codecTpl;

                while (tpl.indexOf("%value") >= 0) {
                    tpl = tpl.replace('%value%', codec.value);
                }
                html += tpl.replace('%caption%', codec.caption);
            }

            this.$codecs.html(html);
        },
        selectCodec: function (name) {
            var $codec = this.$root.find(('input[name=codec]'));
            $codec.filter("[value=" + name + "]").prop("checked", true);
        },
        setProgress: function (pct, label) {
            pct = pct < 0 ? 0 : (pct > 100 ? 100 : pct);
            var strPct = pct + "%";
            this.$progressBar.css("width", strPct);
            this.$progressBar.text(label != undefined ? label : strPct);
        },

        alert: function (message, field, level) {
            if (typeof message != "string") {
                console.error("Wrong alert message argument: " + typeof message);
                return;
            }

            if (field == undefined || field.length < 1) {
                field = "alert" + this.alerts.length;
            }
            if(level == undefined){
                level = 'info';
            }

            this.alerts[field] = this.alertTpl.replace('%level%', level).replace('%message%', message).replace('%name%', field);

            this.printAlerts();
        },
        unalert: function (field) {
            delete this.alerts[field];

            this.printAlerts();
        },
        printAlerts: function () {
            var count = 0;
            var html = "";

            for (var i in this.alerts) {
                if (!this.alerts.hasOwnProperty(i)) {
                    continue;
                }

                html += this.alerts[i];
                count++;
            }

            if (count > 0) {
                this.$alerts.html(html);
                this.$alerts.show();
            } else {
                this.$alerts.hide();
                this.$alerts.text('');
            }

        }


    }
})(window, document);
