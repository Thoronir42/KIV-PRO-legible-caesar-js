$(document).ready(function () {
    const SLEEP_TIME = 5;

    var csSupplier = new CodesetSupplier();
    var codec = new Codec();

    var panel = new View("#wrapper-panel");
    var process;

    setCodecByName('default');


    panel.$buttons.encode.click(function () {
        process = new EncodeProcess(codec, panel.$fields.plainText.val());
        panel.setChoices(process.getChoices());
        updateFields(process);
        panel.showControls('encode');
    });

    panel.$buttons.encodeRandom.click(function () {
        var proc = new EncodeProcess(codec, panel.$fields.plainText.val());
        var bulkSize = Math.floor(proc.wordCount / 20);
        bulkSize = bulkSize < 50 ? 50 : bulkSize;

        var timeDelay = 0;
        var tStart, tEnd, tTotal;


        panel.showControls('progress');
        if(timeDelay > 0){
            panel.setProgress(0);
        } else {
            panel.setProgress(100, "Encoding " + proc.wordCount +" words * " + codec.modulo + " variations");
        }

        console.log("Bulk size is " + bulkSize + " words");

        tStart = performance.now();

        randomEncode(proc, bulkSize, timeDelay, function () {
            panel.setProgress(100);
            panel.showControls('general');
            updateFields(proc);

            tEnd = performance.now();
            tTotal = Math.floor((tEnd - tStart) * 100) / 100;
            console.log(proc.wordCount + " words encoded, each with " + codec.modulo + " variants, in " + tTotal +" ms.");
        });

    });

    panel.$buttons.decode.click(function () {
        var keys = panel.$fields.keys.val().split(' ');
        var ciphers = panel.$fields.cipherText.val().split(' ');
        var tStart, tEnd, tTotal;

        tStart = performance.now();
        var plainWords = codec.decodeAll(ciphers, keys);
        tEnd = performance.now();

        if (typeof plainWords == "string") {
            console.error(plainWords);
        } else {
            panel.$fields.plainText.val(plainWords.join(' '));

            tTotal = Math.floor((tEnd - tStart) * 100) / 100;
            console.log(ciphers.length + " words decoded in " + tTotal +" ms.");
        }
    });

    panel.$buttons.reset.click(function () {
        panel.showControls('general');
    });

    panel.$fields.choices.on('click', 'span', function () {
        var $label = $(this);
        var hasNext = process.select($label.data('offset'));

        panel.setChoices(hasNext ? process.getChoices() : []);

        updateFields(process);
    });

    panel.$root.on('change', "input[name=codec]", function () {
        var name = $(this).val();
        if (name != "custom")
            setCodecByName(name);
    });

    panel.$root.find(".codec-viewer").data('content', function () {
        var codesets = codec.getCodeSets();
        var labels = [];

        var html = "<span class='text-primary'>Codec mod = " + codec.modulo + "</span><hr/>" +
            "<span class='text-muted'>Codec charsets: </span><br/>";

        for (var i in codesets) {
            labels.push("<div class='label label-info'>[" + codesets[i].length + "] " + codesets[i] + "</div>");
        }


        return html + labels.join(', ');
    });

    $('[data-toggle="popover"]').popover();

    panel.setCodecs([
        {'caption': 'Full alphabet', value: 'default'},
        {'caption': 'Original article', value: 'original'},
        {'caption': 'Full minus X', value: 'nox'}
    ]);
    setCodecByName('nox', true);


    function updateFields(process) {
        panel.updateFields(process.getInput(), process.getOutput(), process.getKeys());
    }

    function setCodecByName(name, updatePanel) {
        csSupplier.get(name, function (codesets) {
            var result = codec.setCharsets(codesets);
            if (typeof result == "string") {
                console.error(result);
            }
        }, function (errorMessage) {
            console.error("Codec supplier failerd with: " + errorMessage);
        });
        if (updatePanel === true) {
            panel.selectCodec('default');
        }
    }

    function randomEncode(process, bulkSize, timeDelay, onFinished) {
        console.log(process.step + " / " + process.wordCount);
        var keepGoing;
        while (process.remainingWordCount() > 0) {
            var n = Math.floor(Math.random() * codec.modulo);
            keepGoing = process.select(n);

            if (!keepGoing) {
                // console.log("Select said stop");
                break;
            }

            if (process.step % bulkSize == 0) {
                // console.log("Step reached barrier");
                break;
            }
        }

        if(timeDelay > 0){
            var pct = Math.floor(process.step / process.wordCount * 100);
            panel.setProgress(pct, process.step + " / " + process.wordCount);
        }

        if (keepGoing) {
            setTimeout(function () {
                randomEncode(process, bulkSize, timeDelay, onFinished);
            }, timeDelay);
        } else {
            onFinished();
        }
    }
});


