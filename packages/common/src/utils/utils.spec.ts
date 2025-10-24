import { deepCompare, deepIterate, deepClone, generateId } from './utils';

describe('utils', () => {
  describe('deepCompare', () => {
    it('should return true for identical primitives', () => {
      expect(deepCompare(1, 1)).toBe(true);
      expect(deepCompare('test', 'test')).toBe(true);
      expect(deepCompare(true, true)).toBe(true);
      expect(deepCompare(null, null)).toBe(true);
      expect(deepCompare(undefined, undefined)).toBe(true);
    });

    it('should return false for different primitives', () => {
      expect(deepCompare(1, 2)).toBe(false);
      expect(deepCompare('test', 'different')).toBe(false);
      expect(deepCompare(true, false)).toBe(false);
      expect(deepCompare(null, undefined)).toBe(false);
    });

    it('should return true for identical objects', () => {
      const obj1 = { a: 1, b: 'test', c: true };
      const obj2 = { a: 1, b: 'test', c: true };
      expect(deepCompare(obj1, obj2)).toBe(true);
    });

    it('should return false for objects with different values', () => {
      const obj1 = { a: 1, b: 'test', c: true };
      const obj2 = { a: 1, b: 'test', c: false };
      expect(deepCompare(obj1, obj2)).toBe(false);
    });

    it('should return false for objects with different keys', () => {
      const obj1 = { a: 1, b: 'test' };
      const obj2 = { a: 1, c: 'test' };
      expect(deepCompare(obj1, obj2)).toBe(false);
    });

    it('should compare nested objects correctly', () => {
      const obj1 = { a: 1, b: { c: 2, d: 'test' } };
      const obj2 = { a: 1, b: { c: 2, d: 'test' } };
      const obj3 = { a: 1, b: { c: 3, d: 'test' } };
      expect(deepCompare(obj1, obj2)).toBe(true);
      expect(deepCompare(obj1, obj3)).toBe(false);
    });
  });

  describe('deepIterate', () => {
    it('should iterate through all nested properties', () => {
      const obj = {
        a: 1,
        b: {
          c: 2,
          d: 'test'
        },
        e: [1, 2, 3]
      };
      const values: any[] = [];
      deepIterate(obj, (holder, key, value) => {
        values.push({ key, value });
      });

      expect(values).toEqual(jasmine.arrayContaining([
        { key: 'a', value: 1 },
        { key: 'c', value: 2 },
        { key: 'd', value: 'test' }
      ]));
    });

    it('should handle arrays correctly', () => {
      const arr = [1, { a: 2 }, [3, 4]];
      const values: any[] = [];
      deepIterate(arr, (holder, key, value) => {
        values.push({ key, value });
      });

      expect(values).toEqual(jasmine.arrayContaining([
        { key: 'a', value: 2 }
      ]));
    });

    it('should handle null values', () => {
      const values: any[] = [];
      deepIterate(null, (holder, key, value) => {
        values.push({ key, value });
      });
      expect(values).toEqual([]);
    });
  });

  describe('deepClone', () => {
    it('should clone primitives', () => {
      expect(deepClone(1)).toBe(1);
      expect(deepClone('test')).toBe('test');
      expect(deepClone(true)).toBe(true);
      expect(deepClone(null)).toBe(null);
    });

    it('should clone objects', () => {
      const obj = { a: 1, b: 'test', c: true };
      const cloned = deepClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
    });

    it('should clone nested objects', () => {
      const obj = { a: 1, b: { c: 2, d: 'test' } };
      const cloned = deepClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned.b).not.toBe(obj.b);
    });

    it('should clone arrays', () => {
      const arr = [1, { a: 2 }, [3, 4]];
      const cloned = deepClone(arr);
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
      expect(cloned[1]).not.toBe(arr[1]);
      expect(cloned[2]).not.toBe(arr[2]);
    });

    it('should handle circular references', () => {
      const obj: any = { a: 1 };
      obj.self = obj;
      const cloned = deepClone(obj);
      expect(cloned.a).toBe(1);
      expect(cloned.self).toBe(cloned);
    });

    it('should respect ignored types', () => {
      class Test {}
      const instance = new Test();
      const obj = { a: 1, instance };
      const cloned = deepClone(obj, [Test]);
      expect(cloned.instance).toBe(instance);
    });
  });

  describe('generateId', () => {
    it('should generate initial id as 1 for empty array', () => {
      const arr: Array<{id: number}> = [];
      expect(generateId(arr)).toBe(1);
    });

    it('should generate next id after last item', () => {
      const arr: Array<{id: number}> = [
        { id: 1 },
        { id: 2 },
        { id: 3 }
      ];
      expect(generateId(arr)).toBe(4);
    });

    it('should handle gaps in id sequence', () => {
      const arr: Array<{id: number}> = [
        { id: 1 },
        { id: 3 },
        { id: 5 }
      ];
      expect(generateId(arr)).toBe(6);
    });

    it('should wrap around when reaching MAX_VALUE', () => {
      const arr: Array<{id: number}> = [
        { id: Number.MAX_VALUE }
      ];
      expect(generateId(arr)).toBe(1);
    });

    it('should find first available id after wrapping', () => {
      const arr: Array<{id: number}> = [
        { id: Number.MAX_VALUE },
        { id: 0 },
        { id: 1 }
      ];
      expect(generateId(arr)).toBe(2);
    });
  });
});