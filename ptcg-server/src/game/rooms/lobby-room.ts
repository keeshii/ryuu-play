import { GameRoom, GameClient } from "./game-room";
import { GameInfo, LobbyInfo } from "./game-info.interface";
import { Room } from "./room";
import { RoomClient } from "./room-client";
import { User } from "../../storage";

export interface LobbyClient extends RoomClient {
  room: LobbyRoom;
  games: GameClient[];
}

export class LobbyRoom extends Room<LobbyClient> {

  private games: GameRoom[] = [];

  public join(user: User): LobbyClient {
    const client = this.joinRoom(user);
    client.games = [];
    this.broadcast('lobby:join', client);
    return client;
  }

  public leave(client: LobbyClient) {
    super.leave(client);
    this.broadcast('lobby:leave', client);
    client.games.forEach(game => game.leave());
  }

  public createGame(client: LobbyClient): GameClient {
    const gameRoom = new GameRoom(this.generateGameId());
    this.games.push(gameRoom);

    gameRoom.on('game:gameInfo', (gameInfo: GameInfo) => this.updateGameInfo(gameInfo));
    gameRoom.on('game:destroy', () => this.deleteGame(gameRoom));
    gameRoom.on('game:join', (gameClient: GameClient) => this.onJoinGame(gameClient));
    gameRoom.on('game:leave', (gameClient: GameClient) => this.onLeaveGame(gameClient));

    this.broadcast('lobby:createGame', gameRoom.id);
    const gameClient = gameRoom.join(client);
    client.games.push(gameClient);
    return gameClient;
  }

  public getGame(gameId: number): GameRoom | undefined {
    return this.games.find(game => game.id === gameId);
  }

  public getLobbyInfo(): LobbyInfo {
    const users = this.clients.map(client => ({
      userId: client.user.id,
      name: client.user.name,
      ranking: client.user.ranking,
      connected: true
    }));
    const games = this.games.map(game => game.gameInfo);
    return { users, games };
  }

  private deleteGame(game: GameRoom): void {
    const index = this.games.indexOf(game);
    if (index === -1) {
      return;
    }
    this.games.splice(index, 1);
    this.broadcast('lobby:deleteGame', game.id);
  }

  private updateGameInfo(gameInfo: GameInfo): void {
    this.broadcast('lobby:gameInfo', gameInfo);
  }

  private onJoinGame(gameClient: GameClient) {
    gameClient.lobbyClient.games.push(gameClient);
  }

  private onLeaveGame(gameClient: GameClient) {
    const index = gameClient.lobbyClient.games.indexOf(gameClient);
    if (index !== -1) {
      gameClient.lobbyClient.games.splice(index, 1);
    }
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
