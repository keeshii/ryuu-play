import { Server, Socket } from 'socket.io';
import { ApiErrorEnum } from '../common/errors';

export type Response<R = void> = (message: string, data?: R | ApiErrorEnum) => void;

export type Handler<T, R> = (data: T, response: Response<R>) => void;

interface Listener<T, R> {
  message: string,
  handler: Handler<T, R>
}

export class SocketWrapper {

  public io: Server;
  public socket: Socket;
  private listeners: Listener<any, any>[] = [];

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  public attachListeners(): void {
    for (let i = 0; i < this.listeners.length; i++) {
      const listener = this.listeners[i];

      this.socket.on(listener.message, async <T, R>(data: T, fn: Function) => {
        const response: Response<R> =
          (message: string, data?: R | ApiErrorEnum) => fn && fn({message, data});
        try {
          await listener.handler(data, response);
        } catch(error) {
          response('error', error.message);
        }
      });
    }
  }

  public addListener<T, R>(message: string, handler: Handler<T, R>) {
    const listener = {message, handler};
    this.listeners.push(listener);
  }

  public emit(event: string, ...args: any[]): boolean {
    return this.socket.emit(event, ...args);
  }

}
