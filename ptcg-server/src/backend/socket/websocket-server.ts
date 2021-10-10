import * as http from 'http';
import { Server, Socket, ServerOptions } from 'socket.io';

import { Core } from '../../game/core/core';
import { SocketClient } from './socket-client';
import { User } from '../../storage';
import { authMiddleware } from './auth-middleware';
import {config} from '../../config';

export type Middleware = (socket: Socket, next: (err?: any) => void) => void;

export class WebSocketServer {
  public server: Server | undefined;

  constructor(private core: Core) { }

  public async listen(httpServer: http.Server): Promise<void> {
    const opts: Partial<ServerOptions> = {};

    if (config.backend.allowCors) {
      opts.cors = { origin: '*' };
    }

    const server = new Server(httpServer, opts);

    this.server = server;
    server.use(authMiddleware);

    server.on('connection', (socket: Socket) => {
      const user: User = (socket as any).user;

      const socketClient = new SocketClient(user, this.core, server, socket);
      this.core.connect(socketClient);
      socketClient.attachListeners();

      socket.on('disconnect', () => {
        this.core.disconnect(socketClient);
        user.updateLastSeen();
      });
    });
  }

}
