import * as http from 'http';
import * as io from 'socket.io';

import { Core } from '../../game/core/core';
import { SocketClient } from './socket-client';
import { User } from '../../storage';
import { authSocket } from './auth-socket';

export type Middleware = (socket: io.Socket, next: (err?: any) => void) => void;

export class WebSocketServer {
  public server: io.Server | undefined;

  constructor(private core: Core) { }

  public async listen(httpServer: http.Server): Promise<void> {
    const server = io.listen(httpServer);

    this.server = server;
    server.use(authSocket);

    server.on('connection', (socket: io.Socket) => {
      const user: User = (socket as any).user;

      const socketClient = new SocketClient(user, server, socket);
      this.core.connect(socketClient);

      socketClient.attachListeners();

      socket.on('disconnect', () => {
        this.core.disconnect(socketClient);
      });
    });
  }

}
