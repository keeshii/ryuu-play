import * as io from 'socket.io';
import * as ioc from 'socket.io-client';

export class StorageClient {

  private socket: any;

  constructor() {}

  public connect(address: string, port: number) {
    this.socket = ioc.connect(`http://${address}:${port}`) as any;
  }

  public sendHello() {
    const socket: io.Socket = this.socket;
    socket.emit('hello', {data: 'data'}, function (response: any) {
      console.log('received response: ', response);
    });
  }

}
