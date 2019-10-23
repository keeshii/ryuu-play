import { GameRoom, GameClient } from "./game-room";
import { GameInfo, LobbyInfo } from "./rooms.interface";
import { Room } from "./room";
import { RoomClient } from "./room-client";
import { User } from "../../storage";
import {generateId} from "../../utils/utils";

export interface LobbyClient extends RoomClient {
  room: LobbyRoom;
  games: GameClient[];
}

export class LobbyRoom extends Room<LobbyClient> {

  private games: GameRoom[] = [];

  public join(user: User): LobbyClient {
    const client = this.joinRoom(user);
    client.games = [];
    this.broadcast('lobby:join', client.userInfo);
    return client;
  }

  public leave(client: LobbyClient) {
    super.leave(client);
    this.broadcast('lobby:leave', client.userInfo);
    client.games.forEach(game => game.leave());
  }

  public createGame(client: LobbyClient): GameClient {
    const gameRoom = new GameRoom(generateId(this.games));
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
    const users = this.clients.map(client => client.userInfo);
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

}
