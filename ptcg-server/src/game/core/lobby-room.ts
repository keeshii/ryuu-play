// import { RoomClient } from "./room-client";
// import { User } from "../../storage";
import { GameRoom } from "./game-room";
import { Room } from "./room";
import { RoomClient } from "./room-client";

export class LobbyRoom extends Room {

  private games: GameRoom[] = [];

  public getGame(gameId: number): GameRoom | undefined {
    return this.games.find(game => game.id === gameId);
  }

  public createGame(client: RoomClient<LobbyRoom>): RoomClient<GameRoom> {
    const gameRoom = new GameRoom(this, this.generateGameId());
    this.games.push(gameRoom);
    const gameClient = gameRoom.join(client.user);
    this.broadcast('lobby:createGame', gameRoom.id);
    return gameClient;
  }

  public deleteGame(game: GameRoom): void {
    const index = this.games.indexOf(game);
    if (index === -1) {
      return;
    }
    this.games.splice(index, 1);
    this.broadcast('lobby:deleteGame', game.id);
  }

  private generateGameId(): number {
    if (this.games.length === 0) {
      return 1;
    }

    const table = this.games[this.games.length - 1];
    let id = table.id + 1;

    while (this.games.find(g => g.id === id)) {
      if (id === Number.MAX_VALUE) {
        id = 0;
      }
      id = id + 1;
    }

    return id;
  }

}
