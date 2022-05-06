import { GameLog } from '../../game-message';

export type StateLogParam = { [key: string]: string | number };

export class StateLog {
  public id: number = 0;
  public client: number;
  public params: StateLogParam;
  public message: GameLog;

  constructor(
    message: GameLog,
    params: StateLogParam = {},
    client: number = 0,
  ) {
    this.message = message;
    this.params = params;
    this.client = client;
  }
}
