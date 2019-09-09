import * as http from 'http';
import * as io from 'socket.io';

export type Response<R = void> = (message: string, data?: R) => void;

export type Handler<T, R> = (socket: io.Socket, data: T, response: Response<R>) => void;

export interface Listener<T, R> {
  message: string,
  handler: Handler<T, R>
}

export class Websocket {
  protected listeners: Listener<any, any>[] = [];

  constructor() { }

  public addListener<T, R>(message: string, handler: Handler<T, R>) {
    const listener = {message, handler};
    this.listeners.push(listener);
  }

  public async listen(httpServer: http.Server): Promise<void> {
    const ws = io.listen(httpServer);

    ws.on('connection', (socket: io.Socket) => {

      for (let i = 0; i < this.listeners.length; i++) {
        const listener = this.listeners[i];

        socket.on(listener.message, <T>(data: T, fn: Function) => {
          listener.handler(socket, data, (status, data) => {
            return fn && fn({status: status, data: data});
          });
        });

      }
    });
  }

}
