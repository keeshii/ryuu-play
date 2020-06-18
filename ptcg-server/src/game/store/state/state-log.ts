export enum StateLogLevel {
  DEBUG,
  INFO,
  ERROR
}

export class StateLog {
  public id: number = 0;
  public level: StateLogLevel;
  public client: number;
  public message: string;

  constructor(
    message: string,
    client: number = 0,
    level: StateLogLevel = StateLogLevel.INFO
  ) {
    this.message = message;
    this.client = client;
    this.level = level;
  }
}
