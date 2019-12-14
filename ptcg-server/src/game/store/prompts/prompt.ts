export abstract class Prompt<T> {

  readonly abstract type: string;
  public id: number;
  public result: T | undefined;

  constructor(public playerId: number) {
    this.id = 0;
  }

}
