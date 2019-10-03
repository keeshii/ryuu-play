import { AddPlayerAction } from '../store/actions/add-player-action';
import { User } from '../../storage';
import { logger } from '../../utils';
import { Store } from '../store/store';

export class Game {

  public users: User[] = [];
  public store: Store = new Store();

  constructor(public id: number, public owner: User) {
    this.users.push(owner);
  }

  join(user: User): boolean {
    if (this.users.indexOf(user) !== -1) {
      return false;
    }

    logger.log(`User ${user.name} joined the table ${this.id}.`);

    this.users.push(user);
    return true;
  }

  leave(user: User): boolean {
    const index = this.users.indexOf(user);
    if (index === -1) {
      return false;
    }
    this.users.splice(index, 1);
    return true;
  }

  play(user: User, deck: string[]) {
    logger.log(`User ${user.name} starts playing at table ${this.id}.`);

    const action = new AddPlayerAction(deck);
    this.store.dispatch(action);
  }

}
