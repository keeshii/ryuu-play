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
  Messages,
  Profile,
  Ranking,
  Replays,
  ResetPassword
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
    define('/v1/avatars', Avatars);
    define('/v1/cards', Cards);
    define('/v1/decks', Decks);
    define('/v1/game', Game);
    define('/v1/login', Login);
    define('/v1/messages', Messages);
    define('/v1/profile', Profile);
    define('/v1/ranking', Ranking);
    define('/v1/replays', Replays);
    define('/v1/resetPassword', ResetPassword);

    if (config.sets.scansDir) {
      app.use('/scans', express.static(config.sets.scansDir));
    }
    app.use('/avatars', express.static(config.backend.avatarsDir));

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

  public configureWebUi(absolutePath: string): void {
    this.app.use(express.static(absolutePath));
    this.app.use('*', (req, res) => res.sendFile(absolutePath + '/index.html'));
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
