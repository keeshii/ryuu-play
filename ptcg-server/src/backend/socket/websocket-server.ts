import * as http from 'http';
import * as io from 'socket.io';

import { Socket } from './socket.interface';
import { SocketHandler } from './socket-handler';

export type Middleware = (socket: io.Socket, next: (err?: any) => void) => void;

export class WebSocketServer {
  public server: io.Server | undefined;  
  private socketHandlers: SocketHandler[] = [];
  private middlewares: Middleware[] = [];

  constructor() { }

  public addHandler(handler: SocketHandler) {
    this.socketHandlers.push(handler);
  }

  public async listen(httpServer: http.Server): Promise<void> {
    const server = io.listen(httpServer);

    this.server = server;
    this.middlewares.forEach(middleware => server.use(middleware));

    server.on('connection', (socket: Socket) => {
      this.socketHandlers.forEach(handler => handler.attachListeners(socket));
    });

  }

  public use(middleware: Middleware): void {
    this.middlewares.push(middleware);
  }

}
