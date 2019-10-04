import { User } from '../../storage';
import { Game } from './game';
import { MainEvent, MainHandler } from './events/main-events';
import { Subscription } from './subscription';
import { logger } from '../../utils';
import * as events from './events/main-events';

export class Main {

  private games: Game[] = [];
  private subscriptions: Subscription<MainHandler>[] = [];

  constructor() { }

  public join(user: User, handler: MainHandler): void {
    this.dispatch(new events.MainJoinEvent(user));
    this.subscriptions.push({user, handler});
  }

  public disconnect(user: User): void {
    const index = this.subscriptions.findIndex(s => s.user === user);
    if (index === -1) {
      return;
    }
    this.subscriptions.splice(index, 1);
    this.dispatch(new events.MainDisconnectEvent(user));
  }

  private dispatch(event: MainEvent): void {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].handler.handleEvent(event);
    }
  }

  public createGame(user: User): Game {
    const game = new Game(this.generateGameId(), user);

    logger.log(`User ${user.name} created the game ${game.id}.`);

    this.games.push(game);
    this.dispatch(new events.MainCreateGameEvent(game.id));
    return game;
  }

  public getGame(tableId: number): Game | undefined {
    return this.games.find(table => table.id === tableId);
  }

  private generateGameId(): number {
    if (this.games.length === 0) {
      return 1;
    }

    const table = this.games[this.games.length - 1];
    let id = table.id + 1;

    while (this.getGame(id)) {
      if (id === Number.MAX_VALUE) {
        id = 0;
      }
      id = id + 1;
    }

    return id;
  }

}
