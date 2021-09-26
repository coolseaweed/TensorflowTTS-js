/*!
 * Hangul Jamo Library v0.1
 * https://github.com/teampopong/hangul-jamo-js
 *
 * Copyright 2013 Team POPONG
 * Released under the MIT license
 * https://github.com/teampopong/hangul-jamo-js/blob/master/LICENSE
 */
(function () {

    var global = this;  // either window or global
    

    var // 초성
        FIRST_CONSONANTS = [
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
        ],
        // 중성
        VOWELS = [
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
        ],
        // 종성
        LAST_CONSONANTS = [
            '',
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
        ],
        // 독립적인 자음
        SINGLE_CONSONANTS = [
            'ㄱ', 'ㄲ', 'ㄱㅅ', 'ㄴ', 'ㄴㅈ', 'ㄴㅎ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㄹㄱ',
            'ㄹㅁ', 'ㄹㅂ', 'ㄹㅅ', 'ㄹㅌ', 'ㄹㅍ', 'ㄹㅎ', 'ㅁ', 'ㅂ', 'ㅃ',
            'ㅂㅅ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
        ];
    



    // var // 초성
    //     FIRST_CONSONANTS = [
    //         'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ',
    //         'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
    //     ],
    //     // 중성
    //     VOWELS = [
    //         'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅗㅏ', 'ㅗㅐ',
    //         'ㅗㅣ', 'ㅛ', 'ㅜ', 'ㅜㅓ', 'ㅜㅔ', 'ㅜㅣ', 'ㅠ', 'ㅡ', 'ㅡㅣ', 'ㅣ'
    //     ],
    //     // 종성
    //     LAST_CONSONANTS = [
    //         '', 'ㄱ', 'ㄲ', 'ㄱㅅ', 'ㄴ', 'ㄴㅈ', 'ㄴㅎ', 'ㄷ', 'ㄹ', 'ㄹㄱ',
    //         'ㄹㅁ', 'ㄹㅂ', 'ㄹㅅ', 'ㄹㅌ', 'ㄹㅍ', 'ㄹㅎ', 'ㅁ', 'ㅂ', 'ㅂㅅ',
    //         'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
    //     ],
    //     // 독립적인 자음
    //     SINGLE_CONSONANTS = [
    //         'ㄱ', 'ㄲ', 'ㄱㅅ', 'ㄴ', 'ㄴㅈ', 'ㄴㅎ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㄹㄱ',
    //         'ㄹㅁ', 'ㄹㅂ', 'ㄹㅅ', 'ㄹㅌ', 'ㄹㅍ', 'ㄹㅎ', 'ㅁ', 'ㅂ', 'ㅃ',
    //         'ㅂㅅ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
    //     ];
    
    var HANGUL = global.HANGUL = global.HANGUL || {};
    
    HANGUL.toJamos = function (str) {
        var jamos = [];
    
        for (var i = 0, len = str.length; i < len; i++) {
            var _char = str[i];
    
            jamos.push(this.toChosungs(_char));
            jamos.push(this.toJoongsungs(_char));
            jamos.push(this.toJongsungs(_char));
        }
        return jamos.join('');
    };
    
    HANGUL.toChosungs = function (str) {
        var consonants = [];
    
        for (var i = 0, len = str.length; i < len; i++) {
            var code = str.charCodeAt(i),
                offset,
                consonant;


            if (0x1100 <= code && code < 0x1112) {
                offset = parseInt(code - 0x1100);
                consonant = SINGLE_CONSONANTS[offset];
            } else if (0xac00 <= code && code < 0xd7a4) {
                offset = parseInt((code - 0xac00) / 28 / 21);
                consonant = FIRST_CONSONANTS[offset];
            } else {
                consonant = str.charAt(i);
            }
                


            // if (0x3131 <= code && code < 0x314f) {
            //     offset = parseInt(code - 0x3131);
            //     consonant = SINGLE_CONSONANTS[offset];
            // } else if (0xac00 <= code && code < 0xd7a4) {
            //     offset = parseInt((code - 0xac00) / 28 / 21);
            //     consonant = FIRST_CONSONANTS[offset];
            // } else {
            //     consonant = str.charAt(i);
            // }
    
            consonants.push(consonant);
        }
    
        return consonants.join('');
    };
    
    HANGUL.toJoongsungs = function (str) {
        var vowels = [];
    
        for (var i = 0, len = str.length; i < len; i++) {
            var code = str.charCodeAt(i),
                offset,
                vowel;
            
            if (0x1161 <= code && code < 0x1175) {
                offset = parseInt(code - 0x1161);
                consonant = SINGLE_CONSONANTS[offset];
            } else if (0xac00 <= code && code < 0xd7a4) {
                offset = parseInt((code - 0xac00) / 28) % 21;
                vowel = VOWELS[offset];
            } else {
                vowel = '';
            }
    
            vowels.push(vowel);
        }
    
        return vowels.join('');
    };
    
    HANGUL.toJongsungs = function (str) {
        var consonants = [];
    
        for (var i = 0, len = str.length; i < len; i++) {
            var code = str.charCodeAt(i),
                offset,
                consonant;
    
            if (0xac00 <= code && code < 0xd7a4) {
                offset = (code - 0xac00) % 28;
                consonant = LAST_CONSONANTS[offset];
            } else {
                consonant = '';
            }
    
            consonants.push(consonant);
        }
    
        return consonants.join('');
    };
    
    HANGUL.indexOf = function (haystack, needle) {
        var jamoHaystack = HANGUL.toJamos(haystack),
            jamoNeedle = HANGUL.toJamos(needle);
        return jamoHaystack.indexOf(jamoNeedle);
    };
    
    HANGUL.startsWith = function (haystack, needle) {
        return HANGUL.indexOf(haystack, needle) === 0;
    };
    
    }());