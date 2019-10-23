import * as io from 'socket.io';

import { Errors } from '../common/errors';
import { Socket } from './socket.interface';
import { WebSocketServer } from './websocket-server';

export type Response<R = void> = (message: string, data?: R | Errors) => void;

export type Handler<T, R> = (socket: Socket, data: T, response: Response<R>) => void;

export interface Listener<T, R> {
  message: string,
  handler: Handler<T, R>
}

export abstract class SocketHandler {
  protected listeners: Listener<any, any>[] = [];

  constructor(public ws: WebSocketServer) { }

  public addListener<T, R>(message: string, handler: Handler<T, R>) {
    const listener = {message, handler};
    this.listeners.push(listener);
  }

  public attachListeners(socket: Socket): void {
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
  }

  protected get io(): io.Server {
    if (this.ws.server === undefined) {
      throw new Error('Socket io not listening');
    }
    return this.ws.server;
  }

  protected onSocketConnection(socket: Socket): void { }

  protected onSocketDisconnection(socket: Socket): void { }

}
