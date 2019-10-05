import { AddPlayerAction } from '../store/actions/add-player-action';
import { Action } from '../store/actions/action';
import { Prompt } from '../store/promts/prompt';
import { Store } from '../store/store';
import { State } from '../store/state/state';
import { StoreHandler } from '../store/store-handler';
import { User } from '../../storage';
import { logger } from '../../utils';


export interface GameHandler extends StoreHandler {
  onJoin(user: User): void;
  onLeave(user: User): void;
}

export interface GameConnection {
  id: number,
  user: User;
  handler: GameHandler;
  leave(): void;
  play(deck: string[]): void;
  dispatch(acton: Action): void;
}

export interface GameRef {
  id: number;
  user: User;
  join(handler: GameHandler): GameConnection;
}

export class Game implements StoreHandler {

  public store: Store = new Store();
  private connections: GameConnection[] = [];

  constructor(public id: number, private parent: GameHandler) { }

  public createGameRef(user: User): GameRef {
    return {
      id: this.id,
      user: user,
      join: (handler: GameHandler) => this.join(user, handler)
    };
  }

  private join(user: User, handler: GameHandler): GameConnection {
    let connection = this.connections.find(c => c.user === user);

    if (connection !== undefined) {
      return connection;
    }

    logger.log(`User ${user.name} joined the table ${this.id}.`);

    connection = {
      id: this.id,
      user: user,
      handler: handler,
      leave: () => this.leave(user),
      play: (deck: string[]) => this.play(user, deck),
      dispatch: (action: Action) => this.dispatch(user, action)
    };

    this.connections.forEach(c => c.handler.onJoin(user));
    this.parent.onJoin(user);
    this.connections.push(connection);
    return connection;
  }

  private leave(user: User): boolean {
    let index = this.connections.findIndex(c => c.user === user);
    if (index === -1) {
      return false;
    }
    this.connections.splice(index, 1);
    this.connections.forEach(c => c.handler.onLeave(user));
    this.parent.onLeave(user);
    return true;
  }

  private play(user: User, deck: string[]) {
    logger.log(`User ${user.name} starts playing at table ${this.id}.`);

    const action = new AddPlayerAction(deck);
    this.store.dispatch(action);
  }

  private dispatch(user: User, action: Action) {
    this.store.dispatch(action);
  }

  public getConnectionsCount(): number {
    return this.connections.length;
  }

  public onStateChange(state: State) {
    this.parent.onStateChange(state);

    for (let i = 0; i < this.connections.length; i++) {
      // TODO: hide not public / secret data
      this.connections[i].handler.onStateChange(state);
    }
  }

  public resolvePrompt(prompt: Prompt<any>): boolean {
    prompt.resolve(true);
    return true;
  }

}
