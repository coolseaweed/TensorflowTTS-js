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



const korean_re = /^[가-힣\.\?\!]+$/;

function convertText(text) {
    let sequence = [];

    let m = text.match(korean_re);

    console.log(m);
    if(m == null){
        console.log('korean not verified!')
        console.log(`Before:${text}`)
        text = cleanText(text);
        console.log(`After:${text}`)

    }
    else {
        console.log('korean verified!');
        console.log(text)
    }



    // while (text.length != 0) {
    //     let m = text.match(curly_re);

    //     if (m == null) {
    //         sequence = sequence.concat(convertSymbols(HANGUL.toJamos(text)));
    //         break;
    //     }
    //     sequence = sequence.concat(convertSymbols(HANGUL.toJamos(m[1])));
    //     sequence = sequence.concat(convertArpabet(m[2]));
    //     text = m[3];
    // }
    // sequence = sequence.concat(symbolId("eos"));
    // return sequence;
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
    text = normalizeText(text);
    // text = expandNumbers(text);
    // text = collapseWhitespace(text);
    return text;
}



const comma_number_re = /([0-9][0-9\,]+[0-9])/;
const decimal_number_re = /([0-9]+\.[0-9]+)/;
const number_re = /[0-9]+/;

function normalizeText(text) {

    teXT
    // text.replace(/[^가-힣0-9\!\.\?]+/, "");
    return text
}

function expandNumbers(text) {

    text = text.replace(comma_number_re, remove_commas);
    text = text.replace(decimal_number_re, expand_decimal_point);
    text = text.replace(number_re, expand_number);
    return text;
}

function collapseWhitespace(text) {
    text.replace(/\s+/, " ");
    return text;
}


function remove_useless(match, group) {
    console.log(group);
    // return group.replace(",", "");
}


function remove_commas(match, group) {
    return group.replace(",", "");
}

function expand_decimal_point(match, group) {
    return group.replace(".", " 쩜 ");
}


function expand_number(match) {
    const num = parseInt(match);
    console.log(num);

    // return numberToWords.toWords(num);
}




async function tts(text, ttsStatus) {
    ttsStatus.innerText = "Converting input";
    text = "12345678910 ㅇㅇㅇ"
    text = "기안84,403.2는 바보., 기안84,403.2는 바보. ^&^$%@$@#$@!@"
    text = "^&^$%@$@#$@!@기안84"
    // text = "안녕하세요."
    console.log(text);
    temp = convertText(text);



    // const input_ids = tf.tensor([convertText(text)], null, 'int32');

    // inputs = {
    //     "input_ids": input_ids,
    //     "speaker_ids": tf.tensor([0], null, 'int32'),
    //     "speed_ratios:0": tf.tensor([1.0], null, 'float32'),
    //     "f0_ratios": tf.tensor([1.0], null, 'float32'),
    //     "energy_ratios": tf.tensor([1.0], null, 'float32'),
    // };
    
    
    // ttsStatus.innerText = "목소리 만드는중 ... (뚝딱뚝딱) ";
    // console.time("inference");
    // console.time("mel generation");
    // console.log(await text2mel)
    // const mel = await (await text2mel).executeAsync(inputs);
    // console.log(mel)
    
    // console.timeEnd("mel generation");
    // console.time("vocoding");
    // ttsStatus.innerText = "음성 생성중 ... (똑딱똑딱)";
    // const wav = (await vocoder).execute(mel[3]);
    // console.timeEnd("vocoding");
    // console.timeEnd("inference");
    // ttsStatus.innerText = "끗!!";
    // playAudio(wav);
    // for (let i = 0; i < inputs.length; i++) {
    //     inputs[i].dispose();
    // }
}

document.addEventListener('DOMContentLoaded', function () {
    const ttsInput = document.getElementById("tts-input");
    const ttsStart = document.getElementById("tts-start");
    const ttsStatus = document.getElementById("tts-status");
    ttsStart.addEventListener("click", async function () {
        await tts(ttsInput.value, ttsStatus);
    });
});


