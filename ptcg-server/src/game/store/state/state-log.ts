export class StateLog {
  public id: number = 0;
  public client: number;
  public message: string;

  constructor(
    message: string,
    client: number = 0,
  ) {
    this.message = message;
    this.client = client;
  }
}
