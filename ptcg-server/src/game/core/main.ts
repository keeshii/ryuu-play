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

  private games: Game[] = [];
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

  private disconnect(user: User): void {
    const index = this.connections.findIndex(c => c.user === user);
    if (index === -1) {
      return;
    }
    this.connections.forEach(c => c.handler.onDisconnect(user));
    this.connections.splice(index, 1);
  }

  private createGame(user: User, handler: GameHandler): GameConnection {
    const id = this.generateGameId();
    
    const gameCleaner = {
      onJoin: () => {},
      onLeave: () => this.removeEmptyGame(id),
      onStateChange: () => {},
      resolvePrompt: () => false
    };

    const game = new Game(this.generateGameId(), gameCleaner);

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

  private removeEmptyGame(gameId: number) {
    const index = this.games.findIndex(g => g.id === gameId);
    if (index === -1) {
      return;
    }
    const game = this.games[index];
    if (game.getConnectionsCount() > 0) {
      return;
    }
    this.games.splice(index, 1);
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
