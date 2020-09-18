import { Client } from "../client/client.interface";
import { Core } from "./core";
import { User, Message } from "../../storage";

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

    await message.send(receiver);

    this.core.clients.forEach(c => {
      if (c.user.id === receiver.id) {
        c.onMessage(client, message);
      }
    });
  }

}
