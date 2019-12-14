import { BotClient } from '../game/bots/bot-client';
import { Client } from '../game/core/client';
import { Game } from '../game/core/game';
import { SimpleGameHandler } from './simple-game-handler';
import { State } from '../game/store/state/state';


export class SimpleBot extends BotClient {

  private gameHandlers: SimpleGameHandler[] = [];

  public onConnect(client: Client): void { }

  public onDisconnect(client: Client): void { }

  public onGameJoin(client: Client, game: Game): void { }

  public onGameLeave(client: Client, game: Game): void { }

  public onGameAdd(game: Game): void { }

  public onGameDelete(game: Game): void {
    const gameHandler = this.gameHandlers.find(handler => handler.game === game);
    if (gameHandler !== undefined) {
      this.deleteGameHandler(gameHandler);
    }
  }

  public onStateChange(game: Game, state: State): void {
    const gameHandler = this.gameHandlers.find(handler => handler.game === game);
    if (gameHandler !== undefined) {
      gameHandler.onStateChange(state);
    }
  }

  public createGame(): Game {
    const game = super.createGame();
    this.addGameHandler(game);
    return game;
  }

  public joinGame(game: Game): void {
    super.joinGame(game);
    this.addGameHandler(game);
  }

  private addGameHandler(game: Game): SimpleGameHandler {
    const gameHandler = new SimpleGameHandler(this, game);
    this.gameHandlers.push(gameHandler);
    return gameHandler;
  }

  private deleteGameHandler(gameHandler: SimpleGameHandler): void {
    const index = this.gameHandlers.indexOf(gameHandler);
    if (index !== -1) {
      this.gameHandlers.splice(index, 1);
    }
  }

}
