import { Client } from "../client/client.interface";
import { Core } from "./core";
import { User, Conversation, Message } from "../../storage";

export class Messager {

  private core: Core;

  constructor(core: Core) {
    this.core = core;
  }

  public async sendMessage(client: Client, receiver: User, text: string): Promise<void> {
    const time = Date.now();

    const message = new Message();
    message.sender = client.user;
    message.created = time;
    message.text = text;

    const conversation = await this.getConversation(client.user, receiver);
    conversation.lastMessage = message;
    message.conversation = conversation;

    await message.save();
    await conversation.save();

    this.core.clients.forEach(c => {
      if (c.user.id === receiver.id) {
        c.onMessage(client, message);
      }
    });
  }

  private async getConversation(user1: User, user2: User): Promise<Conversation> {
    let conversations = await Conversation.find({
      where: [
        { user1: { id: user1.id }, user2: { id: user2.id }},
        { user1: { id: user2.id }, user2: { id: user1.id }}
      ]
    });
    let conversation = (conversations || []).pop();

    if (conversation === undefined) {
      conversation = new Conversation();
      conversation.user1 = user1;
      conversation.user2 = user2;
    }

    return conversation;
  }

}
