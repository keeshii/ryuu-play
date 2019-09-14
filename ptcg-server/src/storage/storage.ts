import 'reflect-metadata';
import { createConnection, EntityManager, Connection } from 'typeorm';
import { User } from './model';
import { config } from '../utils';

export class Storage {

  private connection: null | Connection = null;

  constructor() { }

  public async connect(): Promise<void> {
    this.connection = await createConnection({
      ...config.storage,
      entities: [
        User
      ],
      synchronize: true,
      logging: false
    });
  }

  public get manager(): EntityManager {
    if (this.connection === null) {
      throw new Error('Not connected to the database.');
    }
    return this.connection.manager;
  }

}
