// import { RoomClient } from "./room-client";
// import { User } from "../../storage";
import { Room } from "./room";
import { RoomClient, RoomEmitter } from "./room-client";
import { User } from "../../storage";


export class GameRoom extends Room {

  public id: number;

  constructor(private lobby: RoomEmitter, id: number) {
    super();
    this.id = id;
  }

  public hasClient(client: RoomClient): boolean {
    return this.clients.indexOf(client) !== -1;
  }

  public join(user?: User): RoomClient {
    this.broadcast('game:join', user);
    this.lobby.notify('game:join', user);
    return super.join(user);
  }

}
