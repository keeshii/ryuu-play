import * as express from 'express';
import { json } from 'body-parser';

import { LobbyRoom } from '../game/rooms/lobby-room';
import { LobbySocketHandler } from './socket/lobby-socket-handler';
import { Storage } from '../storage';
import { WebSocketServer } from './socket/websocket-server';
import { authSocket } from './socket/auth-socket';
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
    lobbyRoom: LobbyRoom
  ): Controller;
}

export class App {

  private app: express.Application;
  private ws: WebSocketServer;
  private storage: Storage;
  private lobbyRoom: LobbyRoom = new LobbyRoom();

  constructor() {
    this.storage = new Storage();
    this.app = this.configureExpress();
    this.ws = this.configureWebSocket();
  }

  private configureExpress(): express.Application {
    const storage = this.storage;
    const lobbyRoom = this.lobbyRoom;
    const app = express();
    const define = function (path: string, controller: ControllerClass): void {
      const instance = new controller(path, app, storage, lobbyRoom);
      instance.init();
    };

    app.use(json());
    app.use(cors());
    define('/login', Login);

    return app;
  }

  private configureWebSocket(): WebSocketServer {
    const ws = new WebSocketServer();

    ws.use(authSocket);
    ws.addHandler(new LobbySocketHandler(ws, this.lobbyRoom));

    return ws;
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
