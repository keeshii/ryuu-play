import { Client } from '../../game/client/client.interface';
import { Core } from '../../game/core/core';
import { CoreSocket } from './core-socket';
import { Message, User } from '../../storage';
import { MessageInfo } from '../interfaces/message.interface';
import { SocketWrapper, Response } from './socket-wrapper';
import { Errors } from '../common/errors';

export class MessageSocket {

  private client: Client;

  constructor(client: Client, private socket: SocketWrapper, private core: Core) {
    this.client = client;

    // core listeners
    this.socket.addListener('message:send', this.sendMessage.bind(this));
  }

  public onMessage(from: Client, message: Message): void {
    const messageInfo: MessageInfo = {
      senderId: message.sender.id,
      created: message.created,
      text: message.text,
      isRead: message.isRead
    };
    const user = CoreSocket.buildUserInfo(from.user);
    this.socket.emit('message:received', { message: messageInfo, user });
  }

  private async sendMessage(params: { text: string, toUserId: number }, response: Response<void>): Promise<void> {
    try {
      const user = await User.findOne(params.toUserId);
      if (user === undefined) {
        throw new Error(Errors.CANNOT_SEND_MESSAGE);
      }
      await this.core.messager.sendMessage(this.client, user, params.text);

    } catch (error) {
      response('error', Errors.CANNOT_SEND_MESSAGE);
    }

    response('ok');
  }

}
