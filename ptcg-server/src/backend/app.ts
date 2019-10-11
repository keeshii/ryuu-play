import * as express from 'express';
import { json } from 'body-parser';
import { Storage } from '../storage';
import { Websocket } from './common/websocket';
import { config } from '../config';
import { cors } from './services/cors';

import {
  Controller,
  Login
} from './controllers';

interface ControllerClass {
  new(path: string, app: express.Application, db: Storage): Controller;
}

export class App {

  private app: express.Application;
  private ws: Websocket = new Websocket();
  private storage: Storage;

  constructor() {
    this.storage = new Storage();
    this.app = this.configureExpress();
  }

  private configureExpress(): express.Application {
    const storage = this.storage;
    const app = express();
    const define = function (path: string, controller: ControllerClass): void {
      const instance = new controller(path, app, storage);
      instance.init();
    };

    app.use(json());
    app.use(cors());
    define('/login', Login);

    return app;
  }

  public connectToDatabase(): Promise<void> {
    return this.storage.connect();
  }

  public start(): void {
    const address = config.backend.address;
    const port = config.backend.port;

    const httpServer = this.app.listen(port, address, () => {
      console.log(`Server listening on ${address}:${port}.`);
    });

    this.ws.listen(httpServer);
  }

}
