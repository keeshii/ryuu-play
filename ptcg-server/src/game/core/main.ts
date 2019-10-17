import { User } from '../../storage';
import { Game, GameConnection, GameHandler, GameRef } from './game';
import { logger } from '../../utils';

export interface MainHandler {
  onConnect(user: User): void;
  onDisconnect(user: User): void;
  onGameAdd(game: Game): void;
  onGameDelete(game: Game): void;
  onGameStatus(game: Game): void;
}

export interface MainConnection {
  user: User;
  handler: MainHandler;
  createGame(handler: GameHandler): GameConnection;
  getGame(gameId: number): GameRef | undefined;
  disconnect(): void;
}

export class Main {

  public games: Game[] = [];
  private connections: MainConnection[] = [];

  constructor() { }

  public connect(user: User, handler: MainHandler): MainConnection {

    const connection: MainConnection = {
      user: user,
      handler: handler,
      createGame: (handler: GameHandler) => this.createGame(user, handler),
      getGame: (gameId: number) => this.getGame(user, gameId),
      disconnect: () => this.disconnect(user)
    };

    this.connections.forEach(c => c.handler.onConnect(user));
    this.connections.push(connection);
    return connection;
  }

  public get users(): User[] {
    return this.connections.map(connection => connection.user);
  }

  private disconnect(user: User): void {
    const index = this.connections.findIndex(c => c.user === user);
    if (index === -1) {
      return;
    }
    this.connections.forEach(c => c.handler.onDisconnect(user));
    this.connections.splice(index, 1);
  }

  private createGame(user: User, handler: GameHandler): GameConnection {
    const game: Game = new Game(this.generateGameId(), {
      onJoin: () => {},
      onLeave: () => this.clearEmptyGame(game),
      onStateStable: () => {},
      onStateChange: () => {},
      resolvePrompt: () => false,
    });

    logger.log(`User ${user.name} created the game ${game.id}.`);

    this.games.push(game);
    this.connections.forEach(c => c.handler.onGameAdd(game));
    return game.createGameRef(user).join(handler);
  }

  private getGame(user: User, gameId: number): GameRef | undefined {
    const game = this.games.find(g => g.id === gameId);
    if (game === undefined) {
      return undefined;
    }
    return game.createGameRef(user);
  }

  private clearEmptyGame(game: Game) {
    if (game.getConnectionsCount() > 0) {
      return;
    }
    const index = this.games.indexOf(game);
    if (index === -1) {
      return;
    }
    this.games.splice(index, 1);
    this.connections.forEach(c => c.handler.onGameDelete(game));
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
