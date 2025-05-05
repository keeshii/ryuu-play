export class Md5 {

  private static _string: string;
  private static x: Array<number> = <Array<number>> [];
  private static k: number;
  private static AA: number;
  private static BB: number;
  private static CC: number;
  private static DD: number;
  private static a: number;
  private static b: number;
  private static c: number;
  private static d: number;
  private static S11: number = 7;
  private static S12: number = 12;
  private static S13: number = 17;
  private static S14: number = 22;
  private static S21: number = 5;
  private static S22: number = 9;
  private static S23: number = 14;
  private static S24: number = 20;
  private static S31: number = 4;
  private static S32: number = 11;
  private static S33: number = 16;
  private static S34: number = 23;
  private static S41: number = 6;
  private static S42: number = 10;
  private static S43: number = 15;
  private static S44: number = 21;

  private static rotateLeft =
    (lValue: number, iShiftBits: number): number => (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));

  private static AddUnsigned(lX: number, lY: number): number {
    const lX8 = (lX & 0x80000000);
    const lY8 = (lY & 0x80000000);
    const lX4 = (lX & 0x40000000);
    const lY4 = (lY & 0x40000000);
    const lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);

    if (lX4 & lY4) {
      return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    }

    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
      }
      else {
        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
      }
    }
    else {
      return (lResult ^ lX8 ^ lY8);
    }
  }

  private static F = (x: number, y: number, z: number): number => (x & y) | ((~x) & z);

  private static G = (x: number, y: number, z: number): number => (x & z) | (y & (~z));

  private static H = (x: number, y: number, z: number): number => (x ^ y ^ z);

  private static I = (x: number, y: number, z: number): number => (y ^ (x | (~z)));

  private static FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = this.AddUnsigned(a, this.AddUnsigned(this.AddUnsigned(this.F(b, c, d), x), ac));
    return this.AddUnsigned(this.rotateLeft(a, s), b);
  }

  private static GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = this.AddUnsigned(a, this.AddUnsigned(this.AddUnsigned(this.G(b, c, d), x), ac));
    return this.AddUnsigned(this.rotateLeft(a, s), b);
  }

  private static HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = this.AddUnsigned(a, this.AddUnsigned(this.AddUnsigned(this.H(b, c, d), x), ac));
    return this.AddUnsigned(this.rotateLeft(a, s), b);
  }

  private static II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = this.AddUnsigned(a, this.AddUnsigned(this.AddUnsigned(this.I(b, c, d), x), ac));
    return this.AddUnsigned(this.rotateLeft(a, s), b);
  }

  private static ConvertToWordArray(str: string): Array<number> {
    const lMessageLength: number = str.length,
      lNumberOfWordsTemp1: number = lMessageLength + 8,
      lNumberOfWordsTemp2: number = (lNumberOfWordsTemp1 - (lNumberOfWordsTemp1 % 64)) / 64,
      lNumberOfWords: number = (lNumberOfWordsTemp2 + 1) * 16,
      lWordArray: Array<number> = Array(lNumberOfWords - 1);
    let lWordCount: number,
      lBytePosition: number = 0,
      lByteCount: number = 0;

    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
      lByteCount++;
    }

    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;

    return lWordArray;
  }

  private static WordToHex(lValue: number): string {
    let wordToHexValue: string = '',
      wordToHexValueTemp: string = '',
      lByte: number,
      lCount: number;

    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      wordToHexValueTemp = '0' + lByte.toString(16);
      wordToHexValue = wordToHexValue + wordToHexValueTemp.substr(wordToHexValueTemp.length - 2, 2);
    }

    return wordToHexValue;
  }

  private static Utf8Encode(str: string): string {
    let utftext: string = '',
      c: number;

    str = str.replace(/\r\n/g, '\n');

    for (let n = 0; n < str.length; n++) {
      c = str.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      }
      else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    }

    return utftext;
  }

  public static init(str: any): string {
    if (typeof str !== 'string') {
      str = JSON.stringify(str);
    }

    this._string = this.Utf8Encode(str);
    this.x = this.ConvertToWordArray(this._string);

    this.a = 0x67452301;
    this.b = 0xEFCDAB89;
    this.c = 0x98BADCFE;
    this.d = 0x10325476;

    for (this.k = 0; this.k < this.x.length; this.k += 16) {
      this.AA = this.a;
      this.BB = this.b;
      this.CC = this.c;
      this.DD = this.d;
      this.a = this.FF(this.a, this.b, this.c, this.d, this.x[this.k], this.S11, 0xD76AA478);
      this.d = this.FF(this.d, this.a, this.b, this.c, this.x[this.k + 1], this.S12, 0xE8C7B756);
      this.c = this.FF(this.c, this.d, this.a, this.b, this.x[this.k + 2], this.S13, 0x242070DB);
      this.b = this.FF(this.b, this.c, this.d, this.a, this.x[this.k + 3], this.S14, 0xC1BDCEEE);
      this.a = this.FF(this.a, this.b, this.c, this.d, this.x[this.k + 4], this.S11, 0xF57C0FAF);
      this.d = this.FF(this.d, this.a, this.b, this.c, this.x[this.k + 5], this.S12, 0x4787C62A);
      this.c = this.FF(this.c, this.d, this.a, this.b, this.x[this.k + 6], this.S13, 0xA8304613);
      this.b = this.FF(this.b, this.c, this.d, this.a, this.x[this.k + 7], this.S14, 0xFD469501);
      this.a = this.FF(this.a, this.b, this.c, this.d, this.x[this.k + 8], this.S11, 0x698098D8);
      this.d = this.FF(this.d, this.a, this.b, this.c, this.x[this.k + 9], this.S12, 0x8B44F7AF);
      this.c = this.FF(this.c, this.d, this.a, this.b, this.x[this.k + 10], this.S13, 0xFFFF5BB1);
      this.b = this.FF(this.b, this.c, this.d, this.a, this.x[this.k + 11], this.S14, 0x895CD7BE);
      this.a = this.FF(this.a, this.b, this.c, this.d, this.x[this.k + 12], this.S11, 0x6B901122);
      this.d = this.FF(this.d, this.a, this.b, this.c, this.x[this.k + 13], this.S12, 0xFD987193);
      this.c = this.FF(this.c, this.d, this.a, this.b, this.x[this.k + 14], this.S13, 0xA679438E);
      this.b = this.FF(this.b, this.c, this.d, this.a, this.x[this.k + 15], this.S14, 0x49B40821);
      this.a = this.GG(this.a, this.b, this.c, this.d, this.x[this.k + 1], this.S21, 0xF61E2562);
      this.d = this.GG(this.d, this.a, this.b, this.c, this.x[this.k + 6], this.S22, 0xC040B340);
      this.c = this.GG(this.c, this.d, this.a, this.b, this.x[this.k + 11], this.S23, 0x265E5A51);
      this.b = this.GG(this.b, this.c, this.d, this.a, this.x[this.k], this.S24, 0xE9B6C7AA);
      this.a = this.GG(this.a, this.b, this.c, this.d, this.x[this.k + 5], this.S21, 0xD62F105D);
      this.d = this.GG(this.d, this.a, this.b, this.c, this.x[this.k + 10], this.S22, 0x2441453);
      this.c = this.GG(this.c, this.d, this.a, this.b, this.x[this.k + 15], this.S23, 0xD8A1E681);
      this.b = this.GG(this.b, this.c, this.d, this.a, this.x[this.k + 4], this.S24, 0xE7D3FBC8);
      this.a = this.GG(this.a, this.b, this.c, this.d, this.x[this.k + 9], this.S21, 0x21E1CDE6);
      this.d = this.GG(this.d, this.a, this.b, this.c, this.x[this.k + 14], this.S22, 0xC33707D6);
      this.c = this.GG(this.c, this.d, this.a, this.b, this.x[this.k + 3], this.S23, 0xF4D50D87);
      this.b = this.GG(this.b, this.c, this.d, this.a, this.x[this.k + 8], this.S24, 0x455A14ED);
      this.a = this.GG(this.a, this.b, this.c, this.d, this.x[this.k + 13], this.S21, 0xA9E3E905);
      this.d = this.GG(this.d, this.a, this.b, this.c, this.x[this.k + 2], this.S22, 0xFCEFA3F8);
      this.c = this.GG(this.c, this.d, this.a, this.b, this.x[this.k + 7], this.S23, 0x676F02D9);
      this.b = this.GG(this.b, this.c, this.d, this.a, this.x[this.k + 12], this.S24, 0x8D2A4C8A);
      this.a = this.HH(this.a, this.b, this.c, this.d, this.x[this.k + 5], this.S31, 0xFFFA3942);
      this.d = this.HH(this.d, this.a, this.b, this.c, this.x[this.k + 8], this.S32, 0x8771F681);
      this.c = this.HH(this.c, this.d, this.a, this.b, this.x[this.k + 11], this.S33, 0x6D9D6122);
      this.b = this.HH(this.b, this.c, this.d, this.a, this.x[this.k + 14], this.S34, 0xFDE5380C);
      this.a = this.HH(this.a, this.b, this.c, this.d, this.x[this.k + 1], this.S31, 0xA4BEEA44);
      this.d = this.HH(this.d, this.a, this.b, this.c, this.x[this.k + 4], this.S32, 0x4BDECFA9);
      this.c = this.HH(this.c, this.d, this.a, this.b, this.x[this.k + 7], this.S33, 0xF6BB4B60);
      this.b = this.HH(this.b, this.c, this.d, this.a, this.x[this.k + 10], this.S34, 0xBEBFBC70);
      this.a = this.HH(this.a, this.b, this.c, this.d, this.x[this.k + 13], this.S31, 0x289B7EC6);
      this.d = this.HH(this.d, this.a, this.b, this.c, this.x[this.k], this.S32, 0xEAA127FA);
      this.c = this.HH(this.c, this.d, this.a, this.b, this.x[this.k + 3], this.S33, 0xD4EF3085);
      this.b = this.HH(this.b, this.c, this.d, this.a, this.x[this.k + 6], this.S34, 0x4881D05);
      this.a = this.HH(this.a, this.b, this.c, this.d, this.x[this.k + 9], this.S31, 0xD9D4D039);
      this.d = this.HH(this.d, this.a, this.b, this.c, this.x[this.k + 12], this.S32, 0xE6DB99E5);
      this.c = this.HH(this.c, this.d, this.a, this.b, this.x[this.k + 15], this.S33, 0x1FA27CF8);
      this.b = this.HH(this.b, this.c, this.d, this.a, this.x[this.k + 2], this.S34, 0xC4AC5665);
      this.a = this.II(this.a, this.b, this.c, this.d, this.x[this.k], this.S41, 0xF4292244);
      this.d = this.II(this.d, this.a, this.b, this.c, this.x[this.k + 7], this.S42, 0x432AFF97);
      this.c = this.II(this.c, this.d, this.a, this.b, this.x[this.k + 14], this.S43, 0xAB9423A7);
      this.b = this.II(this.b, this.c, this.d, this.a, this.x[this.k + 5], this.S44, 0xFC93A039);
      this.a = this.II(this.a, this.b, this.c, this.d, this.x[this.k + 12], this.S41, 0x655B59C3);
      this.d = this.II(this.d, this.a, this.b, this.c, this.x[this.k + 3], this.S42, 0x8F0CCC92);
      this.c = this.II(this.c, this.d, this.a, this.b, this.x[this.k + 10], this.S43, 0xFFEFF47D);
      this.b = this.II(this.b, this.c, this.d, this.a, this.x[this.k + 1], this.S44, 0x85845DD1);
      this.a = this.II(this.a, this.b, this.c, this.d, this.x[this.k + 8], this.S41, 0x6FA87E4F);
      this.d = this.II(this.d, this.a, this.b, this.c, this.x[this.k + 15], this.S42, 0xFE2CE6E0);
      this.c = this.II(this.c, this.d, this.a, this.b, this.x[this.k + 6], this.S43, 0xA3014314);
      this.b = this.II(this.b, this.c, this.d, this.a, this.x[this.k + 13], this.S44, 0x4E0811A1);
      this.a = this.II(this.a, this.b, this.c, this.d, this.x[this.k + 4], this.S41, 0xF7537E82);
      this.d = this.II(this.d, this.a, this.b, this.c, this.x[this.k + 11], this.S42, 0xBD3AF235);
      this.c = this.II(this.c, this.d, this.a, this.b, this.x[this.k + 2], this.S43, 0x2AD7D2BB);
      this.b = this.II(this.b, this.c, this.d, this.a, this.x[this.k + 9], this.S44, 0xEB86D391);

      this.a = this.AddUnsigned(this.a, this.AA);
      this.b = this.AddUnsigned(this.b, this.BB);
      this.c = this.AddUnsigned(this.c, this.CC);
      this.d = this.AddUnsigned(this.d, this.DD);
    }

    const temp = this.WordToHex(this.a) + this.WordToHex(this.b) + this.WordToHex(this.c) + this.WordToHex(this.d);
    return temp.toLowerCase();
  }
}
