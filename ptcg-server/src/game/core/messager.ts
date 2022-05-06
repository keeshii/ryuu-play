import { Client } from '../client/client.interface';
import { Core } from './core';
import { User, Message, Conversation } from '../../storage';

export class Messager {

  private core: Core;

  constructor(core: Core) {
    this.core = core;
  }

  public async sendMessage(client: Client, receiver: User, text: string): Promise<Message> {
    const time = Date.now();

    const message = new Message();
    message.sender = client.user;
    message.created = time;
    message.text = text;

    await message.send(receiver);

    this.core.clients.forEach(c => {
      if (c.user.id === receiver.id) {
        c.onMessage(client, message);
      }
    });

    return message;
  }

  public async readMessages(client: Client, conversationUser: User): Promise<void> {
    const conversation = await Conversation.findByUsers(client.user, conversationUser);
    if (conversation.id === undefined) {
      return;
    }

    // Mark all messages as deleted for given user
    await Message.update({
      conversation: { id: conversation.id },
      sender: { id: conversationUser.id },
    }, {
      isRead: true
    });

    this.core.clients.forEach(c => {
      if (c.user.id === conversationUser.id) {
        c.onMessageRead(client.user);
      }
    });
  }

}
