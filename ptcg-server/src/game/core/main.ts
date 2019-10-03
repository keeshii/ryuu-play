import { User } from '../../storage';
import { Game } from './game';
import { logger } from '../../utils';

export class Main {

  private games: Game[] = [];
  private users: User[] = [];

  constructor() { }

  public join(user: User) {
    this.users.push(user);
  }

  public createGame(user: User): Game {
    const table = new Game(this.generateGameId(), user);

    logger.log(`User ${user.name} created the table ${table.id}.`);

    this.games.push(table);
    return table;
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
