export interface Prompt<T> {

  readonly type: string;

  promise: Promise<T>;

}
