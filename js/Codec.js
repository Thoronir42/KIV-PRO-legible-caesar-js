(function (window, document) {

    const CODEC_MODE_TO_UPPER = 1;
    const CODEC_MIN_SET_LENGTH = 1;

    Codec = function () {
    };

    Codec.prototype = {
        charSets: [],
        charToCharset: {},

        modulo: 0,

        init: function () {

        },

        /**
         * Verifies provided codesets and sets them for furhrer encryption / decryption
         * @param codesets
         * @returns {*}
         */
        setCharsets: function (codesets) {
            var setLengths = [];
            var n = 0;

            if (codesets == undefined || codesets.constructor !== Array) {
                return "Codec received invalid charSets argument";
            }

            var charSetMap = {};

            for (i in codesets) {
                var codeset = this._normalize(codesets[i]);
                var length = codeset.length;
                if (length < CODEC_MIN_SET_LENGTH) {
                    continue;
                }


                var result = this._putCodeest(codeset, n, charSetMap);
                if (typeof result == "string") {
                    return result;
                }
                this.charSets[n] = codeset;
                setLengths[n++] = length;
            }

            this.charToCharset = charSetMap;
            this.modulo = MyMath.lcma(setLengths);

            return true;
        },
        /**
         * Unites Lower/Upper case
         * @param text string to be normalised
         * @returns {string} provided string in normal form
         * @private
         */
        _normalize: function (text) {
            switch (this.mode) {
                default:
                case CODEC_MODE_TO_UPPER:
                    return text.toUpperCase();

            }
        },
        /**
         * Verifies that letters in codeset are not set in charSetMap yet and maps them to n
         *
         * @param codeset new codeset to be inserted
         * @param n codeset number to be in map
         * @param charSetMap char to charset map
         * @returns {*} true or error message
         * @private
         */
        _putCodeest: function (codeset, n, charSetMap) {
            for (var i in codeset) {
                var char = codeset[i];
                if (charSetMap.hasOwnProperty(char)) {
                    return "Duplicate occurence character " + char + " detected";
                }
                charSetMap[char] = n;
            }

            return true;
        },
        /**
         * Encodes provided word into all possible ciphers with current codec
         * @param word
         * @returns {Array}
         */
        getPossibleCiphers: function (word) {
            var ciphers = [];
            for (var i = 0; i < this.modulo; i++) {
                ciphers[i] = this.encode(word, i);
            }

            return ciphers;
        },

        /**
         * Decodes provided words using provided keys
         * @param words ciphers
         * @param keys
         * @returns {*} array of plain text words or error message
         */
        decodeAll: function (words, keys) {
            var plain = [];
            if (words.length != keys.length) {
                return "Words(" + words.length + ") and keys(" + keys.length + ") count did not match.";
            }
            for (var i in words) {
                plain[i] = this.decode(words[i], keys[i]);
            }

            return plain;
        },

        /**
         * Encodes provided word using provided key
         * @param word
         * @param key
         * @returns {*}
         */
        encode: function (word, key) {
            return this._shiftWord(this._normalize(word), key);
        },

        /**
         * Decodec provided cipher using provided key
         * @param cipher
         * @param key
         * @returns {*}
         */
        decode: function (cipher, key) {
            return this._shiftWord(this._normalize(cipher, this.mode), this.modulo - key);
        },

        _shiftWord: function (word, offset) {
            var shifted = "";

            for (var i in word) {
                var p = word[i];
                if (!this.charToCharset.hasOwnProperty(p)) {
                    shifted += p;
                    continue;
                }

                var charset = this.charSets[this.charToCharset[p]];

                var n = charset.indexOf(p);
                n = (n + offset) % charset.length;

                shifted += charset.charAt(n);
            }

            return shifted;
        },
        
        getCodeSets: function () {
            return this.charSets;
        }

    };

    /**
     * Encode process object structure to hold encoding information across functions. Initialisation also copies input
     * words to output words and sets keys to 0s.
     *
     * @param codec codec to be used for encoding
     * @param input input text to be encoded
     * @constructor
     */
    EncodeProcess = function (codec, input) {
        if (input.constructor != Array) {
            input = input.split(" ");
        }
        this.codec = codec;

        this.wordCount = input.length;

        for (var i = 0; i < this.wordCount; i++) {
            this.input[i] = this.output[i] = codec._normalize(input[i]);
            this.keys[i] = 0;
        }

        this.step = 0;
        this._generateChoices();
    };

    EncodeProcess.prototype = {
        codec: null,

        wordCount: 0,
        input: [],
        keys: [],
        output: [],

        step: 0,
        choices: [],


        _generateChoices: function () {
            this.choices = this.codec.getPossibleCiphers(this.input[this.step]);
        },

        /**
         * Selects n-th available cipher to encode current word
         * @param n
         * @returns {boolean} true if there are more words to be encoded
         */
        select: function (n) {
            n %= this.codec.modulo;

            this.output[this.step] = this.choices[n];
            this.keys[this.step] = n;

            if (this.step < this.wordCount - 1) {
                this.step++;
                this._generateChoices();
                return true;
            }

            return false;
        },
        remainingWordCount: function() {
            return this.wordCount - this.step;
        },

        getKeys: function () {
            return this.keys;
        },

        getInput: function () {
            return this.input;
        },

        getOutput: function () {
            return this.output;
        },
        getChoices: function () {
            return this.choices;
        }
    }
})(window, document);
