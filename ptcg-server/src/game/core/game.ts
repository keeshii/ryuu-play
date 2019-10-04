import { AddPlayerAction } from '../store/actions/add-player-action';
import { Action } from '../store/actions/action';
import { Prompt } from '../store/promts/prompt';
import { Store } from '../store/store';
import { State } from '../store/state/state';
import { StoreHandler } from '../store/store-handler';
import { User } from '../../storage';
import { logger } from '../../utils';

export class Game implements StoreHandler {

  public users: User[] = [];
  public store: Store = new Store();
  public handlers: {[name: string]: StoreHandler} = {};

  constructor(public id: number, public owner: User) {
    this.users.push(owner);
  }

  join(user: User, storeHandler: StoreHandler): boolean {
    if (this.users.indexOf(user) !== -1) {
      return false;
    }

    logger.log(`User ${user.name} joined the table ${this.id}.`);

    this.users.push(user);
    this.handlers[user.name] = storeHandler;
    return true;
  }

  leave(user: User): boolean {
    const index = this.users.indexOf(user);
    if (index === -1) {
      return false;
    }
    this.users.splice(index, 1);
    delete this.handlers[user.name];
    return true;
  }

  play(user: User, deck: string[]) {
    logger.log(`User ${user.name} starts playing at table ${this.id}.`);

    const action = new AddPlayerAction(deck);
    this.store.dispatch(action);
  }

  dispatch(action: Action) {
    this.store.dispatch(action);
  }

  onStateChange(state: State) {
    for (let i = 0; i < this.users.length; i++) {
      // TODO: hide not public / secret data
      this.handlers[this.users[i].name].onStateChange(state);
    }
  }

  resolvePrompt(prompt: Prompt<any>): boolean {
    prompt.resolve(true);
    return true;
  }

}
