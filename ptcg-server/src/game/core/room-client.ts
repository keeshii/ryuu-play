import { Room } from "./room";
import { User } from "../../storage";

export type RoomClientCallback<T, R> = (data: T) => R

export interface RoomClientListener<T, R> {
  message: string;
  callback: RoomClientCallback<T, R>;
};


export class RoomClient<S extends Room> {

  public user: User;
  public listeners: RoomClientListener<any, any>[] = [];
  public room: S;

  constructor(room: S, user: User) {
    this.room = room;
    this.user = user;
  }

  public on<T, R>(message: string, callback: RoomClientCallback<T, R>) {
    const listener = {message, callback};
    this.listeners.push(listener);
  }

  public emit<T, R>(message: string, data: T): R | undefined {
    return this.room.emit(this, message, data);
  }

  public leave(): void {
    this.room.leave(this);
  }

}
