import { BotClient } from '../game/bots/bot-client';
import { Client } from '../game/client/client.interface';
import { Game } from '../game/core/game';
import { SimpleGameHandler } from './simple-game-handler';
import { State } from '@ptcg/common';
import { User, Message } from '../storage';
import { SimpleBotOptions } from './simple-bot-options';
import { allSimpleTactics, allPromptResolvers, defaultStateScores,
  defaultArbiterOptions } from './simple-bot-definitions';


export class SimpleBot extends BotClient {

  protected gameHandlers: SimpleGameHandler[] = [];
  private options: SimpleBotOptions;

  constructor(name: string, options: Partial<SimpleBotOptions> = {}) {
    super(name);
    this.options = Object.assign({
      tactics: allSimpleTactics,
      promptResolvers: allPromptResolvers,
      scores: defaultStateScores,
      arbiter: defaultArbiterOptions
    }, options);
  }

  public onConnect(client: Client): void { }

  public onDisconnect(client: Client): void { }

  public onUsersUpdate(users: User[]): void {
    const me = users.find(u => u.id === this.user.id);
    if (me !== undefined) {
      this.user = me;
    }
  }

  public onMessage(from: Client, message: Message): void { }

  public onMessageRead(user: User): void { }

  public onGameJoin(game: Game, client: Client): void {
    if (client === this) {
      const state = game.state;
      this.addGameHandler(game);
      this.onStateChange(game, state);
    }
  }

  public onGameLeave(game: Game, client: Client): void {
    const gameHandler = this.gameHandlers.find(gh => gh.game === game);

    if (client === this && gameHandler !== undefined) {
      this.deleteGameHandler(gameHandler);
      return;
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

  protected addGameHandler(game: Game): SimpleGameHandler {
    const gameHandler = new SimpleGameHandler(this, this.options, game, this.loadDeck());
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
