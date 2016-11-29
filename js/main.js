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
        var barrier = Math.floor(proc.pieces / 20);
        barrier = barrier < 50 ? 50 : barrier;

        panel.showControls('progress');
        panel.setProgress(0);

        randomEncode(proc, barrier, function () {
            panel.setProgress(100);
            panel.showControls('general');
            updateFields(proc);
        });


    });

    panel.$buttons.decode.click(function () {
        var plainWords = codec.decodeAll(panel.$fields.cipherText.val().split(' '), panel.$fields.keys.val().split(' '));
        if (typeof plainWords == "string") {
            console.error(plainWords);
        } else {
            panel.$fields.plainText.val(plainWords.join(' '));
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

    function randomEncode(process, barrier, onFinished) {
        // console.log("Entering encode function on " + process.step + "/" + process.pieces + ". Barrier is " + barrier + ".");
        var keepGoing;
        while (process.remainingWordCount() > 0) {
            var n = Math.floor(Math.random() * codec.modulo);
            keepGoing = process.select(n);

            if (!keepGoing) {
                // console.log("Select said stop");
                break;
            }

            if (process.step % barrier == 0) {
                // console.log("Step reached barrier");
                break;
            }
        }

        var pct = Math.floor(process.step / process.pieces * 100);
        panel.setProgress(pct, process.step + " / " + process.pieces);

        if (keepGoing) {
            setTimeout(function () {
                randomEncode(process, barrier, onFinished);
            }, SLEEP_TIME);
        } else {
            onFinished();
        }
    }
});


