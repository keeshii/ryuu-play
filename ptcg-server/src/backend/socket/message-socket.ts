import { Client } from '../../game/client/client.interface';
import { Core } from '../../game/core/core';
import { CoreSocket } from './core-socket';
import { Message, User } from '../../storage';
import { MessageInfo } from '../interfaces/message.interface';
import { SocketWrapper, Response } from './socket-wrapper';
import { UserInfo } from '../interfaces/core.interface';
import { ApiErrorEnum } from '../common/errors';

export class MessageSocket {

  private client: Client;

  constructor(client: Client, private socket: SocketWrapper, private core: Core) {
    this.client = client;

    // message socket listeners
    this.socket.addListener('message:send', this.sendMessage.bind(this));
    this.socket.addListener('message:read', this.readMessages.bind(this));
  }

  public onMessage(from: Client, message: Message): void {
    const messageInfo: MessageInfo = this.buildMessageInfo(message);
    const user = CoreSocket.buildUserInfo(from.user);
    this.socket.emit('message:received', { message: messageInfo, user });
  }

  public onMessageRead(user: User): void {
    this.socket.emit('message:read', { user: CoreSocket.buildUserInfo(user) });
  }

  private async sendMessage(params: { userId: number, text: string },
    response: Response<{ message: MessageInfo, user: UserInfo }>): Promise<void> {
    let messageInfo: MessageInfo;
    let userInfo: UserInfo;

    const text = (params.text || '').trim();
    if (text.length === 0 || text.length > 2048) {
      response('error', ApiErrorEnum.CANNOT_SEND_MESSAGE);
      return;
    }

    // Do not send message to yourself
    if (this.client.user.id === params.userId) {
      response('error', ApiErrorEnum.CANNOT_SEND_MESSAGE);
      return;
    }

    try {
      const user = await User.findOne(params.userId);
      if (user === undefined) {
        throw new Error(ApiErrorEnum.PROFILE_INVALID);
      }
      const message = await this.core.messager.sendMessage(this.client, user, text);
      messageInfo = this.buildMessageInfo(message);
      userInfo = CoreSocket.buildUserInfo(user);

    } catch (error) {
      response('error', ApiErrorEnum.CANNOT_SEND_MESSAGE);
      return;
    }

    response('ok', { message: messageInfo, user: userInfo });
  }

  private async readMessages(params: { userId: number },
    response: Response<void>): Promise<void> {

    try {
      const user = await User.findOne(params.userId);
      if (user === undefined) {
        throw new Error(ApiErrorEnum.PROFILE_INVALID);
      }
      await this.core.messager.readMessages(this.client, user);

    } catch (error) {
      response('error', ApiErrorEnum.CANNOT_READ_MESSAGE);
      return;
    }

    response('ok');
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
