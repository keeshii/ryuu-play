import * as http from 'http';
import * as io from 'socket.io';

import { Core } from '../../game/core/core';
import { ClientSocket } from './client-socket';
import { MessageSocket } from './message-socket';
import { User } from '../../storage';
import { authMiddleware } from './auth-middleware';

export type Middleware = (socket: io.Socket, next: (err?: any) => void) => void;

export class WebSocketServer {
  public server: io.Server | undefined;

  constructor(private core: Core) { }

  public async listen(httpServer: http.Server): Promise<void> {
    const server = io.listen(httpServer);

    this.server = server;
    server.use(authMiddleware);

    server.on('connection', (socket: io.Socket) => {
      const user: User = (socket as any).user;

      const clientSocket = new ClientSocket(user, this.core, server, socket);
      this.core.connect(clientSocket);
      clientSocket.attachListeners();

      const messageSocket = new MessageSocket(user, this.core, server, socket);
      messageSocket.attachListeners();

      socket.on('disconnect', () => {
        this.core.disconnect(clientSocket);
        user.updateLastSeen();
      });
    });
  }

}
