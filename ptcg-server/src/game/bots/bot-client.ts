import { AddPlayerAction } from '../store/actions/add-player-action';
import { Client } from '../client/client.interface';
import { Game } from '../core/game';
import { GameError, GameMessage } from '../game-error';
import { User } from '../../storage';
import { Core } from '../core/core';
import { State } from '../store/state/state';

export abstract class BotClient implements Client {

  public id: number = 0;
  public name: string;
  public user: User;
  public core: Core | undefined;
  public games: Game[] = [];

  constructor(name: string) {
    this.user = new User();
    this.user.name = name;
    this.name = name;
  }

  public abstract onConnect(client: Client): void;

  public abstract onDisconnect(client: Client): void;

  public abstract onUsersUpdate(users: User[]): void;

  public abstract onGameAdd(game: Game): void;

  public abstract onGameDelete(game: Game): void;

  public abstract onGameJoin(game: Game, client: Client): void;

  public abstract onGameLeave(game: Game, client: Client): void;

  public abstract onStateChange(game: Game, state: State): void;
  
  public abstract onMessage(from: Client, message: string): void;

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
