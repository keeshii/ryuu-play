import { GameMessage } from './game-message';

export class GameError extends Error {

  constructor(code: GameMessage, message?: string) {
    super(message || code);
  }

}
