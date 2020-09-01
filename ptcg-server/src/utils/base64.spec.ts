import { Base64 } from './base64';

describe('Base64', () => {

  let base64: Base64;

  beforeEach(() => {
    base64 = new Base64();
  });

  it('Should throw error if string has UTF-8 characters', () => {
    //when
    const foo = () => base64.encode('Żółcić gęślą jaźń');

    //then
    expect(foo).toThrowError('INVALID_CHARACTER_ERR: DOM Exception 5');
  });

  it('Should encode to base64', () => {
    //when
    const encode1 = base64.encode('');
    const encode2 = base64.encode('123456');
    const encode3 = base64.encode('1234567');
    const encode4 = base64.encode('12345678');

    //then
    expect(encode1).toBe('');
    expect(encode2).toBe('MTIzNDU2');
    expect(encode3).toBe('MTIzNDU2Nw==');
    expect(encode4).toBe('MTIzNDU2Nzg=');
  });

  it('Should throw error if base64 has invalid length', () => {
    //when
    const foo = () => base64.decode('AA');

    //then
    expect(foo).toThrowError('Cannot decode base64');
  });

  it('Should throw error if base64 has invalid character', () => {
    //when
    const foo = () => base64.decode('!@#$');

    //then
    expect(foo).toThrowError('Cannot decode base64');
  });

  it('Should decode from base64', () => {
    //when
    const decode1 = base64.decode('');
    const decode2 = base64.decode('MTIzNDU2');
    const decode3 = base64.decode('MTIzNDU2Nw==');
    const decode4 = base64.decode('MTIzNDU2Nzg=');

    //then
    expect(decode1).toBe('');
    expect(decode2).toBe('123456');
    expect(decode3).toBe('1234567');
    expect(decode4).toBe('12345678');
  });

});
