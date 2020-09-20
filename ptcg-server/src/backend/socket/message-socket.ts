import { Client } from '../../game/client/client.interface';
import { Core } from '../../game/core/core';
import { CoreSocket } from './core-socket';
import { Message, User } from '../../storage';
import { MessageInfo } from '../interfaces/message.interface';
import { SocketWrapper, Response } from './socket-wrapper';
import { UserInfo } from '../interfaces/core.interface';
import { Errors } from '../common/errors';

export class MessageSocket {

  private client: Client;

  constructor(client: Client, private socket: SocketWrapper, private core: Core) {
    this.client = client;

    // core listeners
    this.socket.addListener('message:send', this.sendMessage.bind(this));
  }

  public onMessage(from: Client, message: Message): void {
    const messageInfo: MessageInfo = this.buildMessageInfo(message);
    const user = CoreSocket.buildUserInfo(from.user);
    this.socket.emit('message:received', { message: messageInfo, user });
  }

  private async sendMessage(params: { userId: number, text: string },
    response: Response<{ message: MessageInfo, user: UserInfo }>): Promise<void> {
    let messageInfo: MessageInfo;
    let userInfo: UserInfo;

    try {
      const user = await User.findOne(params.userId);
      if (user === undefined) {
        throw new Error(Errors.PROFILE_INVALID);
      }
      const message = await this.core.messager.sendMessage(this.client, user, params.text);
      messageInfo = this.buildMessageInfo(message);
      userInfo = CoreSocket.buildUserInfo(user);

    } catch (error) {
      response('error', Errors.CANNOT_SEND_MESSAGE);
      return;
    }

    response('ok', { message: messageInfo, user: userInfo });
  }

  private buildMessageInfo(message: Message): MessageInfo {
    const messageInfo: MessageInfo = {
      messageId: message.id,
      senderId: message.sender.id,
      created: message.created,
      text: message.text,
      isRead: message.isRead
    };
    return messageInfo;
  }

}
