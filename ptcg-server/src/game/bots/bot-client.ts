import { AddPlayerAction } from '../store/actions/add-player-action';
import { Client } from '../core/client';
import { Game } from '../core/game';
import { GameError, GameMessage } from '../game-error';
import { User } from '../../storage';

export abstract class BotClient extends Client {

  constructor(name: string) {
    const user = new User();
    user.name = name;
    super(user);
  }

  createGame(deck: string[]): Game {
    if (this.core === undefined) {
      throw new GameError(GameMessage.BOT_NOT_INITIALIZED);
    }
    const game = this.core.createGame(this, deck);
    return game;
  }

  joinGame(game: Game): void {
    if (this.core === undefined) {
      throw new GameError(GameMessage.BOT_NOT_INITIALIZED);
    }
    this.core.joinGame(this, game);
  }

  playGame(game: Game, deck: string[]): void {
    const action = new AddPlayerAction(this.id, this.user.name, deck);
    game.dispatch(this, action);
  }

}
