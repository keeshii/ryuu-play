import * as ioc from 'socket.io-client';

export interface Response<R> {
  message: string,
  data?: R
};

export class WebsocketClient {

  private socket: any;

  constructor() {}

  public connect(address: string, port: number) {
    this.socket = ioc.connect(`http://${address}:${port}`);
  }

  public emit<T, R>(message: string, data?: T): Promise<Response<R>> {
    const promise = new Promise<Response<R>>((resolve, reject) => {
      this.socket.emit(message, data, resolve);
    });
    return promise;
  }

}
