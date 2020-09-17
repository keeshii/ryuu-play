import { Client } from '../../game/client/client.interface';
import { Core } from '../../game/core/core';
import { SocketWrapper, Response } from './socket-wrapper';

export class MessageSocket {

  constructor(client: Client, private socket: SocketWrapper, private core: Core) {
    // core listeners
    this.socket.addListener('message:send', this.sendMessage.bind(this));
  }

  public onMessage(from: Client, message: string): void {
  }

  private sendMessage(params: { text: string, toUserId: number }, response: Response<void>): void {
    console.log(this.core.clients.length);
    response('ok');
  }

}
