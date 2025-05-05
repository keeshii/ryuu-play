import { deepCompare } from '../../utils';
import { JsonDiff, JsonPathDiff } from './json-patch.interface';

export class JsonPatch {

  public diff(src: any, dest: any): JsonDiff[] {
    const deltas = this.delta(src, dest, [], []);
    return deltas.map(d => ({
      op: d.op,
      path: d.path.join('.'),
      val: d.val
    }));
  }

  public apply(src: any, patch: JsonDiff[]) {
    let result = src;
    for (const delta of patch) {
      if (delta.path === '') {
        result = this.applyToObject(result, delta);
      } else {
        const item = this.fromPath(result, delta.path);
        if (item !== undefined) {
          const newValue = this.applyToObject(item.value, delta);
          item.holder[item.key] = newValue;
        }
      }
    }
    return result;
  }

  private delta(src: any, dest: any, path: string[], results: JsonPathDiff[]): JsonPathDiff[] {
    if (src instanceof Object && dest instanceof Object) {
      if (src.constructor !== dest.constructor) {
        results.push({op: 'set', path, val: dest});
        return results;
      }
      if (src instanceof Array && dest instanceof Array) {
        return this.deltaArray(src, dest, path, results);
      }
      return this.deltaObject(src, dest, path, results);
    }
    if (src !== dest) {
      results.push({op: 'set', path, val: dest});
      return results;
    }
    return results;
  }

  private deltaArray(src: any[], dest: any[], path: string[], results: JsonPathDiff[]): JsonPathDiff[] {
    const results1: JsonPathDiff[] = [];
    const results2: JsonPathDiff[] = [];
    src = src.slice();

    let i: number = 0;
    let j: number = 0;
    while (i < dest.length && j < src.length) {
      if (this.isEqual(src[j], dest[i])) {
        i += 1;
        j += 1;
      } else {
        let fromIndex = src.findIndex((value, index) => {
          return index > j && this.isEqual(value, dest[i]);
        });
        if (fromIndex !== -1) {
          const temp = src[fromIndex];
          src[fromIndex] = src[j];
          src[j] = temp;
          results1.push({op: 'move', path, val: [fromIndex, i]});
          j += 1;
          i += 1;
        } else {
          fromIndex = dest.findIndex((value, index) => {
            return index > i && this.isEqual(value, src[j]);
          });
          if (fromIndex === -1) {
            this.delta(src[j], dest[i], [...path, String(i)], results1);
          } else {
            src.splice(j, 0, dest[i]);
            results1.push({op: 'add', path, val: [i, dest[i]]});
          }
          j += 1;
          i += 1;
        }
      }
    }
    while (i < dest.length) {
      results1.push({op: 'add', path, val: [i, dest[i]]});
      i += 1;
    }
    const toDelete: number[] = [];
    while (j < src.length) {
      toDelete.push(j);
      j += 1;
    }
    if (toDelete.length > 0) {
      results1.push({op: 'del', path, val: toDelete});
    }

    results2.push({op: 'set', path, val: dest});

    const option1 = JSON.stringify(results1);
    const option2 = JSON.stringify(results2);
    results.push(...(option1.length < option2.length ? results1 : results2));
    return results;
  }

  private deltaObject(src: any, dest: any, path: string[], results: JsonPathDiff[]): JsonPathDiff[] {
    const srcKeys = Object.keys(src);
    const destKeys = Object.keys(dest);

    for (const key of destKeys) {
      if (!this.isEqual(src[key], dest[key])) {
        this.delta(src[key], dest[key], [...path, key], results);
      }
    }

    const toDelete = [];
    for (const key of srcKeys) {
      if (!destKeys.includes(key)) {
        toDelete.push(key);
      }
    }
    if (toDelete.length > 0) {
      results.push({op: 'del', path, val: toDelete});
    }

    return results;
  }

  private isEqual(src: any, dest: any) {
    return deepCompare(src, dest);
  }

  private applyToObject(root: any, delta: JsonDiff): any {
    switch (delta.op) {
      case 'add': {
        const index = delta.val[0];
        const value = delta.val[1];
        (root as any[]).splice(index, 0, value);
        break;
      }
      case 'set':
        root = delta.val;
        break;
      case 'del': {
        const toDelete: any[] = delta.val.slice();
        if (root instanceof Array) {
          toDelete.sort((a, b) => b - a);
          toDelete.forEach(idx => {
            (root as any[]).splice(idx, 1);
          });
        } else {
          toDelete.forEach(key => {
            delete root[key];
          });
        }
        break;
      }
      case 'move': {
        const arr: any[] = root as any[];
        const fromKey: number = delta.val[0];
        const toKey: number = delta.val[1];
        const temp = arr[fromKey];
        arr[fromKey] = arr[toKey];
        arr[toKey] = temp;
        break;
      }
    }
    return root;
  }

  private fromPath(root: any, path: string): { holder: any, key: string, value: any } | undefined {
    const parts = path.split('.');
    const result = { holder: root, key: '', value: root };
    try {
      for (const part of parts) {
        result.holder = result.value;
        result.value = result.value[part];
        result.key = part;
      }
    } catch (error) {
      return;
    }
    return result;
  }

}
