import { BotClient } from '../game/bots/bot-client';
import { Client } from '../game/core/client';
import { Game } from '../game/core/game';
import { SimpleGameHandler } from './simple-game-handler';
import { State } from '../game/store/state/state';


export class SimpleBot extends BotClient {

  protected gameHandlers: SimpleGameHandler[] = [];

  public onConnect(client: Client): void { }

  public onDisconnect(client: Client): void { }

  public onGameJoin(game: Game, client: Client): void {
    if (client === this) {
      const state = game.state;
      this.addGameHandler(game);
      this.onStateChange(game, state);
    }
  }

  public onGameLeave(game: Game, client: Client): void {
    if (client === this) {
      const gameHandler = this.gameHandlers.find(handler => handler.game === game);
      if (gameHandler !== undefined) {
        this.deleteGameHandler(gameHandler);
      }
    }
  }

  public onGameAdd(game: Game): void { }

  public onGameDelete(game: Game): void { }

  public onStateChange(game: Game, state: State): void {
    const gameHandler = this.gameHandlers.find(handler => handler.game === game);
    if (gameHandler !== undefined) {
      gameHandler.onStateChange(state);
    }
  }

  public createGame(deck: string[]): Game {
    const game = super.createGame(deck);
    this.addGameHandler(game);
    return game;
  }

  public joinGame(game: Game): void {
    super.joinGame(game);
    this.addGameHandler(game);
  }

  protected addGameHandler(game: Game): SimpleGameHandler {
    const gameHandler = new SimpleGameHandler(this, game);
    this.gameHandlers.push(gameHandler);
    return gameHandler;
  }

  protected deleteGameHandler(gameHandler: SimpleGameHandler): void {
    const index = this.gameHandlers.indexOf(gameHandler);
    if (index !== -1) {
      this.gameHandlers.splice(index, 1);
    }
  }

}
