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

    const senderMessage = new Message();
    senderMessage.sender = client.user;
    senderMessage.created = time;
    senderMessage.isRead = true;
    senderMessage.text = text;

    const receiverMessage = new Message();
    receiverMessage.sender = client.user;
    receiverMessage.created = time;
    receiverMessage.isRead = false;
    receiverMessage.text = text;

    await this.insertMessage(client.user, receiver, senderMessage);
    await this.insertMessage(client.user, receiver, receiverMessage);

    this.core.clients.forEach(c => {
      if (c.user.id === receiver.id) {
        c.onMessage(client, receiverMessage);
      }
    });
  }

  private async insertMessage(sender: User, receiver: User, message: Message): Promise<void> {
    const owner = message.isRead ? sender : receiver;
    const user = message.isRead ? receiver : sender;

    let conversations = await Conversation.find({
      where: { owner: { id: owner.id }, user: { id: user.id }}
    });
    let conversation = (conversations || []).pop();

    if (conversation === undefined) {
      conversation = new Conversation();
      conversation.owner = owner;
      conversation.user = user;
    }

    conversation.modified = message.created;
    conversation.isRead = message.isRead;
    conversation.lastMessageText = message.text;
    await conversation.save();

    message.conversation = conversation;
    await message.save();
  }

}
