import { Client } from "./client";
import { CoreError } from "./core-error";
import { CoreMessage } from "./core-messages";
import { Game } from "./game";
import { generateId } from "../../utils/utils";

export class Core {
  private clients: Client[] = [];
  private games: Game[] = [];

  public connect(client: Client): Client {
    const index = this.clients.findIndex(c => c.user.id === client.user.id);
    if (index !== -1) {
      return this.clients[index];
    }
    client.core = this;
    client.games = [];
    this.emit(c => c.onConnect(client));
    this.clients.push(client);
    return client;
  }

  public disconnect(client: Client): void {
    const index = this.clients.indexOf(client);
    if (index === -1) {
      throw new CoreError(CoreMessage.CLIENT_NOT_CONNECTED);
    }
    client.games.forEach(game => this.leaveGame(client, game));
    this.clients.splice(index, 1);
    client.core = undefined;
    this.emit(c => c.onDisconnect(client));
  }

  public createGame(client: Client): Game {
    if (this.clients.indexOf(client) === -1) {
      throw new CoreError(CoreMessage.CLIENT_NOT_CONNECTED);
    }
    const game = new Game(this, generateId(this.games));
    this.games.push(game);
    this.emit(c => c.onGameAdd(game));
    this.joinGame(client, game);
    return game;
  }

  public joinGame(client: Client, game: Game): void {
    if (this.clients.indexOf(client) === -1) {
      throw new CoreError(CoreMessage.CLIENT_NOT_CONNECTED);
    }
    if (this.games.indexOf(game) === -1) {
      throw new CoreError(CoreMessage.GAME_NOT_FOUND);
    }
    if (client.games.indexOf(game) === -1) {
      game.emit(c => c.onGameJoin(client, game));
      client.games.push(game);
      game.clients.push(client);
    }
  }

  public deleteGame(game: Game): void {
    game.clients.forEach(client => {
      const index = client.games.indexOf(game);
      if (index !== -1) {
        client.games.splice(index, 1);
      }
    });
    const index = this.games.indexOf(game);
    if (index !== -1) {
      this.games.splice(index, 1);
      this.emit(c => c.onGameDelete(game));
    }
  }

  public leaveGame(client: Client, game: Game): void {
    if (this.clients.indexOf(client) === -1) {
      throw new CoreError(CoreMessage.CLIENT_NOT_CONNECTED);
    }
    if (this.games.indexOf(game) === -1) {
      throw new CoreError(CoreMessage.GAME_NOT_FOUND);
    }
    const gameIndex = client.games.indexOf(game);
    const clientIndex = game.clients.indexOf(client);
    if (clientIndex !== -1 && gameIndex !== -1) {
      client.games.splice(gameIndex, 1);
      game.clients.splice(clientIndex, 1);
      game.emit(c => c.onGameLeave(client, game));
    }
  }

  public emit(fn: (client: Client) => void): void {
    this.clients.forEach(fn);
  }

}
