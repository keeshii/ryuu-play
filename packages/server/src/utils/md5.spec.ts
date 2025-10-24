import { Md5 } from './md5';

describe('Md5', () => {
  describe('init', () => {
    it('should generate consistent hash for empty string', () => {
      const hash = Md5.init('');
      expect(hash).toBe('d41d8cd98f00b204e9800998ecf8427e');
    });

    it('should generate consistent hash for simple string', () => {
      const hash = Md5.init('test');
      expect(hash).toBe('098f6bcd4621d373cade4e832627b4f6');
    });

    it('should generate consistent hash for longer string', () => {
      const hash = Md5.init('The quick brown fox jumps over the lazy dog');
      expect(hash).toBe('9e107d9d372bb6826bd81d3542a419d6');
    });

    it('should be case sensitive', () => {
      const lowercase = Md5.init('test');
      const uppercase = Md5.init('TEST');
      expect(lowercase).not.toBe(uppercase);
    });

    it('should handle special characters', () => {
      const hash = Md5.init('!@#$%^&*()');
      expect(hash).toBe('05b28d17a7b6e7024b6e5d8cc43a8bf7');
    });

    it('should handle unicode characters', () => {
      const hash = Md5.init('こんにちは');
      expect(hash).toBe('c0e89a293bd36c7a768e4e9d2c5475a8');
    });

    it('should be deterministic', () => {
      const firstHash = Md5.init('test string');
      const secondHash = Md5.init('test string');
      expect(firstHash).toBe(secondHash);
    });

    it('should produce 32 character hex string', () => {
      const hash = Md5.init('any string');
      expect(hash).toMatch(/^[0-9a-f]{32}$/);
    });
  });
});