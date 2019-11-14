import { CoreError } from '../core/core-error';
import { CoreMessage } from '../core/core-messages';
import { Client } from '../core/client';
import { Game } from '../core/game';
import { User } from '../../storage';

export abstract class BotClient extends Client {

  constructor(name: string) {
    const user = new User();
    user.name = name;
    super(user);
  }

  createGame(): Game {
    if (this.core === undefined) {
      throw new CoreError(CoreMessage.BOT_NOT_INITIALIZED);
    }
    const game = this.core.createGame(this);
    return game;
  }

  joinGame(game: Game): void {
    if (this.core === undefined) {
      throw new CoreError(CoreMessage.BOT_NOT_INITIALIZED);
    }
    this.core.joinGame(this, game);
  }

  playGame(game: Game, deck: string[]): void {
    game.playGame(this, deck);
  }

}
