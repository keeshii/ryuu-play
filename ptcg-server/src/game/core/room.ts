import { RoomClient, RoomEmitter } from "./room-client";
import { User } from "../../storage";

export interface RoomListener<T, R> {
  message: string;
  callback: RoomCallback<T, R>;
};

export interface RoomEvent<T, R> {
  message: string;
  callback: EventCallback<T, R, any>;
}

export type RoomCallback<T, R> = (client: RoomClient, data: T) => Promise<R>

export type EventCallback<T, R, S extends Room> = (room: S, data: T) => Promise<R>


export class Room implements RoomEmitter {

  protected clients: RoomClient[] = [];
  protected listeners: RoomListener<any, any>[] = [];
  protected events: RoomEvent<any, any>[] = [];

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

  public emit<T, R>(client: RoomClient, message: string, data: T): Promise<R> {
    let promise: Promise<R> | undefined;
    for (let i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i].message === message) {
        promise = this.listeners[i].callback(client, data);
      }
    }
    return promise ? promise : Promise.reject();
  }

  public notify<T, R>(message: string, data: T): Promise<R> {
    let promise: Promise<R> | undefined;
    for (let i = 0; i < this.events.length; i++) {
      if (this.events[i].message === message) {
        promise = this.events[i].callback(this, data);
      }
    }
    return promise ? promise : Promise.reject();
  }

  protected addEvent<T, R>(message: string, callback: EventCallback<T, R, any>) {
    this.events.push({message, callback});
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

  protected emitTo<T, R>(client: RoomClient, message: string, data: T): Promise<R> {
    const index = this.clients.indexOf(client);
    let promise: Promise<R> | undefined;
    if (index !== -1) {
      for (let i = 0; i < client.listeners.length; i++) {
        if (client.listeners[i].message === message) {
          promise = client.listeners[i].callback(data);
        }
      }
    }
    return promise ? promise : Promise.reject();
  }

}
