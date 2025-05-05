
export interface JsonPathDiff {
  op: 'add' | 'set' | 'del' | 'move';
  path: string[];
  val: any;
}

export interface JsonDiff {
  op: 'add' | 'set' | 'del' | 'move';
  path: string;
  val: any;
}
