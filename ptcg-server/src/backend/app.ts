import * as express from 'express';
import { json } from 'body-parser';

import { Core } from '../game/core/core';
import { GameSocketHandler } from './socket/game-socket-handler';
import { LobbySocketHandler } from './socket/lobby-socket-handler';
import { Storage } from '../storage';
import { WebSocketServer } from './socket/websocket-server';
import { config } from '../config';
import { cors } from './services/cors';

import {
  Controller,
  Login
} from './controllers';

interface ControllerClass {
  new(
    path: string,
    app: express.Application,
    db: Storage,
    core: Core
  ): Controller;
}

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
