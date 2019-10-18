// import { RoomClient } from "./room-client";
// import { User } from "../../storage";
import { GameRoom } from "./game-room";
import { Room } from "./room";
import { RoomClient } from "./room-client";
import { User } from "../../storage";

export interface CreateGameResponse {
  gameId: number;
  client: RoomClient;
}

export class LobbyRoom extends Room {

  private games: GameRoom[] = [];

  constructor() {
    super();
    this.on('lobby:createGame', this.createGame.bind(this));
    
    this.addEvent('game:join', this.joinGame.bind(this));
  }

  public getGame(gameId: number): GameRoom | undefined {
    return this.games.find(game => game.id === gameId);
  }

  private async createGame(client: RoomClient): Promise<CreateGameResponse> {
    const gameRoom = new GameRoom(this, this.generateGameId());
    this.games.push(gameRoom);
    const gameClient = gameRoom.join(client.user);
    this.broadcast('lobby:createGame', gameRoom.id);
    return {client: gameClient, gameId: gameRoom.id};
  }

  private async joinGame(game: GameRoom, user: User): Promise<void> {
    this.broadcast('lobby:joinGame', {user, gameId: game.id});
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
