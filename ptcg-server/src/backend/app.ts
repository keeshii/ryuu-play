import * as express from 'express';
import { json } from 'body-parser';

import { Core } from '../game/core/core';
import { BotManager } from '../game/bots/bot-manager';
import { Storage } from '../storage';
import { WebSocketServer } from './socket/websocket-server';
import { config } from '../config';
import { cors } from './services/cors';

import {
  Avatars,
  ControllerClass,
  Cards,
  Decks,
  Game,
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

    app.use(json({limit: 512 + config.backend.avatarFileSize * 4}));
    app.use(cors());
    define('/avatars', Avatars);
    define('/cards', Cards);
    define('/decks', Decks);
    define('/game', Game);
    define('/login', Login);
    define('/profile', Profile);

    if (config.sets.scansDir) {
      app.use('/scans', express.static(config.sets.scansDir));
    }

    return app;
  }

  private configureWebSocket(): WebSocketServer {
    return new WebSocketServer(this.core);
  }

  public connectToDatabase(): Promise<void> {
    return this.storage.connect();
  }

  public configureBotManager(botManager: BotManager): void {
    botManager.initBots(this.core);
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
