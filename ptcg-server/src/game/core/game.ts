import { User } from '../../storage';
import { Table } from './table';

export class Game {

  tables: Table[] = [];
  users: User[] = [];

  constructor() { }

  public join(user: User) {
    this.users.push(user);
  }

  public createTable(user: User): number {
    console.log(`User ${user.name} created a table.`);
    const table = new Table();
    this.tables.push(table);
    return this.tables.length - 1;
  }

  public joinTable(table: Table) {
    
  }

}
