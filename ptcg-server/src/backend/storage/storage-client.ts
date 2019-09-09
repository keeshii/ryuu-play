import { WebsocketClient } from '../common/websocket-client';

export class StorageClient {

  private socket: WebsocketClient = new WebsocketClient();

  constructor() {}

  public connect(address: string, port: number) {
    this.socket.connect(address, port);
  }

  public sendHello(): Promise<string> {
    return this.socket.emit('hello', {data: 'data'})
      .then(response => response.message);
  }

}
