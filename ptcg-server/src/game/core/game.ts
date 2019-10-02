import { User } from '../../storage';
import { Table } from './table';
import { logger } from '../../utils';

export class Game {

  private tables: Table[] = [];
  private users: User[] = [];

  constructor() { }

  public join(user: User) {
    this.users.push(user);
  }

  public createTable(user: User): Table {
    const table = new Table(this.generateTableId(), user);

    logger.log(`User ${user.name} created the table ${table.id}.`);

    this.tables.push(table);
    return table;
  }

  public getTable(tableId: number): Table | undefined {
    return this.tables.find(table => table.id === tableId);
  }

  private generateTableId(): number {
    if (this.tables.length === 0) {
      return 1;
    }

    const table = this.tables[this.tables.length - 1];
    let id = table.id + 1;

    while (this.getTable(id)) {
      if (id === Number.MAX_VALUE) {
        id = 0;
      }
      id = id + 1;
    }

    return id;
  }

}
