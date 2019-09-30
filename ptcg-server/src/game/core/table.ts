import { Player } from './player';
import { User } from '../../storage';
import { PlayerListener } from '../listeners/player-listener';

export class Table {

  public players: Player[] = [];
  public users: User[] = [];

  constructor() { }

  joinAsPlayer(user: User, playerEventHandler: PlayerListener) {
    return;
  }

}
