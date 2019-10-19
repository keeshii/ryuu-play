import * as http from 'http';
import * as io from 'socket.io';

export type Response<R = void> = (message: string, data?: R) => void;

export type Handler<T, R, S extends io.Socket = io.Socket> = (socket: S, data: T, response: Response<R>) => void;

export type Middleware = (socket: io.Socket, next: (err?: any) => void) => void;

export interface Listener<T, R, S extends io.Socket> {
  message: string,
  handler: Handler<T, R, S>
}

export abstract class Websocket {
  protected listeners: Listener<any, any, any>[] = [];
  protected middlewares: Middleware[] = [];

  constructor() { }

  public addListener<T, R, S extends io.Socket>(message: string, handler: Handler<T, R, S>) {
    const listener = {message, handler};
    this.listeners.push(listener);
  }

  public async listen(httpServer: http.Server): Promise<void> {
    const ws = io.listen(httpServer);

    this.middlewares.forEach(middleware => ws.use(middleware));

    ws.on('connection', (socket: io.Socket) => {

      this.onSocketConnection(socket);

      for (let i = 0; i < this.listeners.length; i++) {
        const listener = this.listeners[i];

        socket.on(listener.message, <T>(data: T, fn: Function) => {
          listener.handler(socket, data, (message, data) => {
            return fn && fn({message, data});
          });
        });

      }

      socket.on('disconnect', () => this.onSocketDisconnection(socket));
    });
  }

  protected addMiddleware(middleware: Middleware): void {
    this.middlewares.push(middleware);
  }

  protected abstract onSocketConnection(socket: io.Socket): void;

  protected abstract onSocketDisconnection(socket: io.Socket): void;

}
