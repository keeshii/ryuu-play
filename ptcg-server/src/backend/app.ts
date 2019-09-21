import * as express from 'express';
import { Server } from 'colyseus';
import { json } from 'body-parser';
import { createServer } from 'http';
import { Storage } from '../storage';
import { config } from '../utils';

import {
  Controller,
  Login
} from './controllers';

import {
  PtcgTable
} from './rooms';

interface ControllerClass {
  new(path: string, app: express.Application, db: Storage): Controller;
}

export class App {

  private app: express.Application;
  private gameServer: Server;
  private storage: Storage;

  constructor() {
    this.storage = new Storage();
    this.app = this.configureExpress();
    this.gameServer = this.configureColyseus();
  }

  private configureExpress(): express.Application {
    const storage = this.storage;
    const app = express();
    const define = function (path: string, controller: ControllerClass): void {
      const instance = new controller(path, app, storage);
      instance.init();
    };

    app.use(json());
    define('/login', Login);

    return app;
  }

  private configureColyseus(): Server {
    const gameServer = new Server({
      server: createServer(this.app),
      express: this.app
    });

    gameServer.define('ptcgTable', PtcgTable);
    return gameServer;
  }

  public connectToDatabase(): Promise<void> {
    return this.storage.connect();
  }

  public start(): Promise<void> {
    const address = config.backend.address;
    const port = config.backend.port;

    return new Promise<void>((resolve, reject) => {
      this.gameServer.listen(port, address, undefined, resolve);
      this.gameServer.onShutdown(reject);
    });
  }
}
