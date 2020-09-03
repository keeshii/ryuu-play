import 'reflect-metadata';
import { createConnection, EntityManager, Connection } from 'typeorm';
import { Deck, User, Avatar, Match, Replay } from './model';
import { config } from '../config';

export class Storage {

  private connection: null | Connection = null;

  constructor() { }

  public async connect(): Promise<void> {
    const storageConfig: any = config.storage;
    this.connection = await createConnection({
      ...storageConfig,
      entities: [
        Avatar,
        Deck,
        Match,
        Replay,
        User
      ],
      synchronize: true,
      logging: false
    });
  }

  public async disconnect(): Promise<void> {
    if (this.connection === null) {
      return;
    }
    return this.connection.close();
  }

  public get manager(): EntityManager {
    if (this.connection === null) {
      throw new Error('Not connected to the database.');
    }
    return this.connection.manager;
  }

}
