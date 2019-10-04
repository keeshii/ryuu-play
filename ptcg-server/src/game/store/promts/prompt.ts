export abstract class Prompt<T> {

  readonly abstract type: string;
  public promise: Promise<T>;
  private resolveFn: (value: T) => any = () => {};
  private rejectFn: (reason: string) => any = () => {};

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolveFn = resolve;
      this.rejectFn = reject;
    });
  }

  resolve(value: T) {
    this.resolveFn(value);
  }

  reject(reason: string) {
    this.rejectFn(reason);
  }

}
