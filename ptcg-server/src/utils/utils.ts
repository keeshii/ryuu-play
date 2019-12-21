
export function deepCompare(x: any, y: any): boolean {

  if (x === y) { return true; }
  // if both x and y are null or undefined and exactly the same

  if (!(x instanceof Object) || !(y instanceof Object)) { return false; }
  // if they are not strictly equal, they both need to be Objects

  if (x.constructor !== y.constructor) { return false; }
  // they must have the exact same prototype chain, the closest we can do is
  // test there constructor.

  for (let p in x) {
    if (!x.hasOwnProperty(p)) { continue; }
    // other properties were tested using x.constructor === y.constructor

    if (!y.hasOwnProperty(p)) { return false; }
    // allows to compare x[ p ] and y[ p ] when set to undefined

    if (x[p] === y[p]) { continue; }
    // if they have the same strict value or identity then they are equal

    if (typeof (x[p]) !== 'object') { return false; }
    // Numbers, Strings, Functions, Booleans must be strictly equal

    if (!deepCompare(x[p], y[p])) { return false; }
    // Objects and Arrays must be tested recursively
  }

  for (let p in y) {
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) { return false; }
    // allows x[ p ] to be set to undefined
  }
  return true;
}


export function deepClone(source: any, refMap: {s: Object, d: Object}[] = []): any {
  if (source === null) { return null; }

  if (source instanceof Array) {
    return source.map((item: any) => deepClone(item, refMap));
  }

  if (source instanceof Object) {
    const ref = refMap.find(item => item.s === source);
    if (ref !== undefined) {
      return ref.d;
    }
    const dest = Object.create(source);
    refMap.push({s: source, d: dest});
    for (let key in source) {
      if (source.hasOwnProperty(key)) {
        dest[key] = deepClone(source[key], refMap);
      }
    }
    return dest;
  }

  return source;
}

export function generateId<T extends {id: number}[]>(array: T): number {
  if (array.length === 0) {
    return 1;
  }

  const last = array[array.length - 1];
  let id = last.id + 1;

  while (array.find(g => g.id === id)) {
    if (id === Number.MAX_VALUE) {
      id = 0;
    }
    id = id + 1;
  }

  return id;
}
