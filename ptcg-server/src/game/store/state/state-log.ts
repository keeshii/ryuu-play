export type StateLogParam = { [key: string]: string | number };

export class StateLog {
  public id: number = 0;
  public client: number;
  public params: StateLogParam;
  public message: string;

  constructor(
    message: string,
    params: StateLogParam = {},
    client: number = 0,
  ) {
    this.message = message;
    this.params = params;
    this.client = client;
  }
}
