import { Room } from "./room";
import { User } from "../../storage";

export type RoomCallback<T, R> = (data: T) => R

export interface RoomListener<T, R> {
  message: string;
  callback: RoomCallback<T, R>;
};

export class RoomClient<S extends Room> {

  public user: User;
  public listeners: RoomListener<any, any>[] = [];
  public room: S;

  constructor(room: S, user: User) {
    this.room = room;
    this.user = user;
  }

  public on<T, R>(message: string, callback: RoomCallback<T, R>) {
    const listener = {message, callback};
    this.listeners.push(listener);
  }

  public leave(): void {
    this.room.leave(this);
  }

}
