import * as express from 'express';
import { json } from 'body-parser';

import { Core } from '../game/core/core';
import { Storage } from '../storage';
import { WebSocketServer } from './socket/websocket-server';
import { config } from '../config';
import { cors } from './services/cors';

import {
  ControllerClass,
  Login,
  Profile
} from './controllers';

export class App {

  private app: express.Application;
  private ws: WebSocketServer;
  private storage: Storage;
  private core: Core = new Core();

  constructor() {
    this.storage = new Storage();
    this.app = this.configureExpress();
    this.ws = this.configureWebSocket();
  }

  private configureExpress(): express.Application {
    const storage = this.storage;
    const core = this.core;
    const app = express();
    const define = function (path: string, controller: ControllerClass): void {
      const instance = new controller(path, app, storage, core);
      instance.init();
    };

    app.use(json());
    app.use(cors());
    define('/login', Login);
    define('/profile', Profile);

    return app;
  }

  private configureWebSocket(): WebSocketServer {
    return new WebSocketServer(this.core);
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
