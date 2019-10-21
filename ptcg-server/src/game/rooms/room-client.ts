import { Room } from "./room";
import { User } from "../../storage";
import { UserInfo } from "./game-info.interface";

export type RoomCallback<T, R> = (data: T) => R

export interface RoomListener<T, R> {
  message: string;
  callback: RoomCallback<T, R>;
};

export class RoomClient {

  public id: number = 0;
  public user: User;
  public userInfo: UserInfo;
  public listeners: RoomListener<any, any>[] = [];
  public room: Room<any>;

  constructor(room: Room<any>, id: number, user: User) {
    this.room = room;
    this.id = id;
    this.user = user;
    this.userInfo = {
      clientId: id,
      userId: user.id,
      name: user.name,
      ranking: user.ranking,
    };
  }

  public on<T, R>(message: string, callback: RoomCallback<T, R>) {
    const listener = {message, callback};
    this.listeners.push(listener);
  }

  public leave(): void {
    this.room.leave(this);
  }

}
