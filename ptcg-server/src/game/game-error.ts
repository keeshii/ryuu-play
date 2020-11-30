import { GameMessage } from './game-message';

export class GameError {
  public message: string;

  constructor(code: GameMessage, message?: string) {
    this.message = message || code;
  }

}
