import * as express from 'express';
import { json } from 'body-parser';
import { Storage } from '../storage';
import { config } from '../utils';

import {
  Controller,
  Login
} from './controllers';

interface ControllerClass {
  new(path: string, app: express.Application, db: Storage): Controller;
}

export class App {

  private app: express.Application;
  private storage: Storage;

  constructor() {
    this.app = express();
    this.storage = new Storage();
    this.initApp();
  }

  private define(path: string, controller: ControllerClass): void {
    let instance = new controller(path, this.app, this.storage);
    instance.init();
  }

  private initApp(): void {
    this.app.use(json());

    this.define('/login', Login);
  }

  public connectToDatabase(): Promise<void> {
    return this.storage.connect();
  }

  public start(): Promise<void> {
    const address = config.backend.address;
    const port = config.backend.port;

    return new Promise<void>((resolve, reject) => {
      const server = this.app.listen(port, address, resolve);
      server.on('error', reject);
    });
  }
}
