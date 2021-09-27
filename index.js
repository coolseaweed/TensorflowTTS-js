tf.enableProdMode()

const text2mel = tf.loadGraphModel('models/FASTSPEECH2/int8/model.json');
const vocoder = tf.loadGraphModel('models/MB_MELGAN/int8/model.json');
// const text2mel = tf.loadGraphModel('tfjs_opt_models/FASTSPEECH2/epoch_200000_baseline_int8/model.json');
// const vocoder = tf.loadGraphModel('tfjs_opt_models/MB_MELGAN/epoch_1000000_baseline_int8/model.json');


const audioContext = new AudioContext();
async function playAudio(wav) {
    const buf = audioContext.createBuffer(1, wav.shape[1], 22050);
    buf.copyToChannel(await wav.data(), 0);
    var source = audioContext.createBufferSource();
    source.buffer = buf;
    source.connect(audioContext.destination);
    source.start();
}


const symbols = [
    "pad",
    "-",
    "!",
    "'",
    "(",
    ")",
    ",",
    "-",
    ".",
    ":",
    ";",
    "?",
    " ",
    "\u1100", // 'ㄱ'
    "\u1101", // 'ㄲ'
    "\u1102", // 'ㄴ'
    "\u1103", // 'ㄷ'
    "\u1104", // 'ㄸ'
    "\u1105", // 'ㄹ'
    "\u1106", // 'ㅁ'
    "\u1107", // 'ㅂ'
    "\u1108", // 'ㅃ'
    "\u1109", // 'ㅅ'
    "\u110a", // 'ㅆ'
    "\u110b", // 'ㅇ'
    "\u110c", // 'ㅈ'
    "\u110d", // 'ㅉ'
    "\u110e", // 'ㅉ'
    "\u110f", // 'ㅊ'
    "\u1110", // 'ㅋ'
    "\u1111", // 'ㅍ'
    "\u1112", // 'ㅎ'
    "\u1161", // 'ㅏ'
    "\u1162", // 'ㅐ'
    "\u1163", // 'ㅑ'
    "\u1164", // 'ㅒ'
    "\u1165", // 'ㅓ'
    "\u1166", // 'ㅔ'
    "\u1167", // 'ㅕ'
    "\u1168", // 'ㅖ'
    "\u1169", // 'ㅗ'
    "\u116a", // 'ㅘ'
    "\u116b", // 'ㅙ'
    "\u116c", // 'ㅚ'
    "\u116d", // 'ㅛ'
    "\u116e", // 'ㅜ'
    "\u116f", // 'ㅝ'
    "\u1170", // 'ㅞ'
    "\u1171", // 'ㅟ'
    "\u1172", // 'ㅠ'
    "\u1173", // 'ㅡ'
    "\u1174", // 'ㅢ'
    "\u1175", // 'ㅣ'
    "\u11a8", // 'ㄱ'
    "\u11a9", // 'ㄲ'
    "\u11aa", // 'ㄳ'
    "\u11ab", // 'ㄴ'
    "\u11ac", // 'ㄵ'
    "\u11ad", // 'ㄶ'
    "\u11ae", // 'ㄷ'
    "\u11af", // 'ㄹ'
    "\u11b0", // 'ㄺ'
    "\u11b1", // 'ㄻ'
    "\u11b2", // 'ㄼ'
    "\u11b3", // 'ㄽ'
    "\u11b4", // 'ㄾ'
    "\u11b5", // 'ㄿ'
    "\u11b6", // 'ㅀ'
    "\u11b7", // 'ㅁ'
    "\u11b8", // 'ㅂ'
    "\u11b9", // 'ㅄ'
    "\u11ba", // 'ㅅ'
    "\u11bb", // 'ㅆ'
    "\u11bc", // 'ㅇ'
    "\u11bd", // 'ㅈ'
    "\u11be", // 'ㅊ'
    "\u11bf", // 'ㅋ'
    "\u11c0", // 'ㅌ'
    "\u11c1", // 'ㅍ'
    "\u11c2", // 'ㅎ'
    "eos",
]



function symbolId(symbol) {
    return symbols.indexOf(symbol);
}

const curly_re = /(.*?)\{(.+?)\}(.*)/;

function convertText(text) {
    let sequence = [];

    while (text.length != 0) {
        let m = text.match(curly_re);

        if (m == null) {
            sequence = sequence.concat(convertSymbols(HANGUL.toJamos(text)));
            break;
        }
        sequence = sequence.concat(convertSymbols(HANGUL.toJamos(m[1])));
        sequence = sequence.concat(convertArpabet(m[2]));
        text = m[3];
    }
    sequence = sequence.concat(symbolId("eos"));
    return sequence;
}

function convertSymbols(text) {
    if (typeof text == 'string') {
        text = text.split('');
    }
    return text.filter(keepSymbol).map(symbolId);
}

function convertArpabet(text) {
    return convertSymbols(text.split(/\s+/).map(char => "@" + char));
}

function keepSymbol(symbol) {
    return symbols.indexOf(symbol) != -1 && symbol != "_" && symbol != "~";
}

function cleanText(text) {
    text = transliterate(text);
    text = text.toLowerCase();
    text = expandNumbers(text);
    text = expandAbbreviations(text);
    text = collapseWhitespace(text);
    return text;
}

function collapseWhitespace(text) {
    text.replace(/\s+/, " ");
    return text;
}



const comma_number_re = /([0-9][0-9\,]+[0-9])/;
const decimal_number_re = /([0-9]+\.[0-9]+)/;
const dollars_re = /\$([0-9\.\,]*[0-9]+)/;
const ordinal_re = /[0-9]+(st|nd|rd|th)/;
const number_re = /[0-9]+/;

function expandNumbers(text) {
    text = text.replace(comma_number_re, remove_commas);
    text = text.replace(dollars_re, expand_dollars);
    text = text.replace(decimal_number_re, expand_decimal_point);
    text = text.replace(ordinal_re, expand_ordinal);
    text = text.replace(number_re, expand_number);
    return text;
}

function remove_commas(match, group) {
    return group.replace(",", "");
}


function expand_decimal_point(match, group) {
    return group.replace(".", " 쩜 ");
}


function expand_ordinal(match) {
    return numberToWords.toWordsOrdinal(match);
}


function expand_number(match) {
    const num = parseInt(match);
    return numberToWords.toWords(num);
}




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
    ttsStart.addEventListener("click", async function () {
        await tts(ttsInput.value, ttsStatus);
    });
});


