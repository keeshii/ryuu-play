import { RoomClient } from "./room-client";
import { User } from "../../storage";

export interface RoomListener<T, R> {
  message: string;
  callback: RoomCallback<T, R>;
};

export type RoomCallback<T, R> = (client: RoomClient<any>, data: T) => R

export class Room {

  protected clients: RoomClient<any>[] = [];
  protected listeners: RoomListener<any, any>[] = [];

  public join(user: User): RoomClient<any> {
    const client = new RoomClient(this, user);
    this.clients.push(client);
    return client;
  }

  public leave(client: RoomClient<any>): void {
    const index = this.clients.indexOf(client);
    if (index !== -1) {
      this.clients.splice(index, 1);
    }
  }

  public emit<T, R>(client: RoomClient<any>, message: string, data: T): R | undefined {
    let response: R | undefined;
    for (let i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i].message === message) {
        response = this.listeners[i].callback(client, data);
      }
    }
    return response;
  }

  protected on<T, R>(message: string, callback: RoomCallback<T, R>) {
    const listener = {message, callback};
    this.listeners.push(listener);
  }

  protected broadcast<T>(message: string, data: T) {
    this.clients.forEach(client => {
      for (let i = 0; i < client.listeners.length; i++) {
        if (client.listeners[i].message === message) {
          client.listeners[i].callback(data);
        }
      }
    });
  }

  protected emitTo<T, R>(client: RoomClient<any>, message: string, data: T): R | undefined {
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
