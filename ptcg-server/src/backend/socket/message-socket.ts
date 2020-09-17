import * as io from 'socket.io';
import { User } from '../../storage';
import { Core } from '../../game/core/core';
import { SocketWrapper, Response } from './socket-wrapper';

export class MessageSocket extends SocketWrapper {

  constructor(user: User, core: Core, io: io.Server, socket: io.Socket) {
    super(io, socket);

    // core listeners
    this.addListener('message:send', this.sendMessage.bind(this));
  }

  private sendMessage(params: { text: string, toUserId: number }, response: Response<void>): void {
    response('ok');
  }

}
