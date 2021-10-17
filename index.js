tf.enableProdMode()
// tf.setBackend('webgl')

const text2mel = tf.loadGraphModel('models/FASTSPEECH2/int8/model.json');
const vocoder = tf.loadGraphModel('models/MB_MELGAN/int8/model.json');



// ----------------- FUNCTIONS  -----------------

const audioContext = new AudioContext();
async function playAudio(wav) {
    const buf = audioContext.createBuffer(1, wav.shape[1], 22050);
    buf.copyToChannel(await wav.data(), 0);
    var source = audioContext.createBufferSource();
    source.buffer = buf;
    source.connect(audioContext.destination);
    source.start();
}


const korean_re = /[가-힣0-9\.\!\?]+/g;
const decimal_number_re = /([0-9]+\.[0-9]+)/g;
const number_re = /([0-9]+)/g;

function convertText(text) {

    let sequence = [];
    
    text = normalizeText(text);
    console.log(`NORM: ${text}`)
    
    sequence = sequence.concat(convertSymbols(HANGUL.toJamos(text)));

    return sequence;
}


function normalizeText(text) {

    text = text.replace(decimal_number_re, expandDecimalPoint);
    text = text.replace(number_re, convertNumber);
    text = text.match(korean_re).join(' ');
    text = collapseWhitespace(text);

    return text
}


function expandDecimalPoint(match, group) {
    return group.replace(".", "쩜");
}

function convertNumber(text) {

    return text.split('').map(char => singleNum2kor[char]).join('');
}

function collapseWhitespace(text) {
    text.replace(/\s+/, " ");
    return text;
}

function convertSymbols(text) {
    if (typeof text == 'string') {
        text = text.split('');
    }
    return text.filter(keepSymbol).map(symbolId);
}

function keepSymbol(symbol) {
    return symbols.indexOf(symbol) != -1 && symbol != "_" && symbol != "~";
}




// ----------------- MAIN -----------------

async function tts(text, ttsStatus) {
    ttsStatus.innerText = "Converting input";

    const input_ids = tf.tensor([convertText(text)], null, 'int32');

    inputs = {
        "input_ids": input_ids,
        "speaker_ids": tf.tensor([0], null, 'int32'),
        "speed_ratios:0": tf.tensor([1.0], null, 'float32'),
        "f0_ratios": tf.tensor([1.0], null, 'float32'),
        "energy_ratios": tf.tensor([1.0], null, 'float32'),
    };
    
    
    ttsStatus.innerText = "목소리 만드는중 ... (뚝딱뚝딱) ";
    console.time("inference");
    console.time("mel generation");
    console.log(await text2mel)
    const mel = await (await text2mel).executeAsync(inputs);
    console.log(mel)
    
    console.timeEnd("mel generation");
    console.time("vocoding");
    ttsStatus.innerText = "음성 생성중 ... (똑딱똑딱)";
    const wav = (await vocoder).execute(mel[3]);
    console.timeEnd("vocoding");
    console.timeEnd("inference");
    ttsStatus.innerText = "끗!!";
    playAudio(wav);
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].dispose();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const ttsInput = document.getElementById("tts-input");
    const ttsStart = document.getElementById("tts-start");
    const ttsStatus = document.getElementById("tts-status");
    let runtime = document.getElementById("runtime");

    ttsStart.addEventListener("click", async function () {
        await tts(ttsInput.value, ttsStatus);
    });


});


