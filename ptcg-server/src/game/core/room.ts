import { RoomClient, RoomResponse, RoomEmitter } from "./room-client";
import { User } from "../../storage";

export interface RoomListener<T, R> {
  message: string;
  callback: RoomCallback<T, R>;
};

export type RoomCallback<T, R> = (client: RoomClient, data: T, response?: RoomResponse<R>) => void

export class Room implements RoomEmitter {

  protected clients: RoomClient[] = [];
  protected listeners: RoomListener<any, any>[] = [];

  public join(user?: User): RoomClient {
    const client = new RoomClient(this, user);
    this.clients.push(client);
    return client;
  }

  public leave(client: RoomClient): void {
    const index = this.clients.indexOf(client);
    if (index !== -1) {
      this.clients.splice(index, 1);
    }
  }

  public emit<T, R>(client: RoomClient, message: string, data: T, response?: RoomResponse<R>): void {
    for (let i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i].message === message) {
        this.listeners[i].callback(client, data, response);
      }
    }
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

  protected emitTo<T, R>(client: RoomClient, message: string, data: T, response?: RoomResponse<R>): void {
    const index = this.clients.indexOf(client);
    if (index !== -1) {
      for (let i = 0; i < client.listeners.length; i++) {
        if (client.listeners[i].message === message) {
          client.listeners[i].callback(data, response);
        }
      }
    }
  }

}
