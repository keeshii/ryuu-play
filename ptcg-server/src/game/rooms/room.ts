import { RoomClient, RoomListener, RoomCallback } from "./room-client";
import { User } from "../../storage";

export class Room<Client extends RoomClient = RoomClient> {

  protected clients: Client[] = [];
  protected listeners: RoomListener<any, any>[] = [];

  public leave(client: Client): void {
    const index = this.clients.indexOf(client);
    if (index !== -1) {
      this.clients.splice(index, 1);
    }
  }

  public on<T, R>(message: string, callback: RoomCallback<T, R>) {
    const listener = {message, callback};
    this.listeners.push(listener);
  }

  public off<T, R>(message: string, callback: RoomCallback<T, R>) {
    const index = this.listeners.findIndex(l => l.message === message && l.callback === callback);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  protected joinRoom(user: User): Client {
    const client = new RoomClient(this, user) as Client;
    this.clients.push(client);
    return client;
  }

  protected broadcast<T>(message: string, data: T) {
    for (let i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i].message === message) {
        this.listeners[i].callback(data);
      }
    }
    this.clients.forEach(client => {
      for (let i = 0; i < client.listeners.length; i++) {
        if (client.listeners[i].message === message) {
          client.listeners[i].callback(data);
        }
      }
    });
  }

  protected emitTo<T, R>(client: Client, message: string, data: T): R | undefined {
    const index = this.clients.indexOf(client);
    let response: R | undefined;
    if (index !== -1) {
      for (let i = 0; i < client.listeners.length; i++) {
        if (client.listeners[i].message === message) {
          response = client.listeners[i].callback(data);
        }
      }
    }
    return response;
  }

}
