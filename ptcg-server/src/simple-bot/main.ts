import { Bot, Main, MainConnection, MainHandler, Game, GameConnection } from '../game';
import { User } from '../storage';
import { SimpleGameHandler } from './simple-game-handler';

export class SimpleBot implements Bot, MainHandler {

  private connection: MainConnection;

  constructor(
    public user: User,
    public main: Main
  ) {
    this.connection = main.connect(user, this);
  }

  public createGame(): GameConnection {
    const gameHandler = new SimpleGameHandler(this.user.name);
    const game = this.connection.createGame(gameHandler);
    gameHandler.setGame(game);
    return game;
  }

  public joinGame(gameId: number): GameConnection {
    const gameRef = this.connection.getGame(gameId);
    if (gameRef === undefined) {
      throw new Error('Invalid game id');
    }
    const gameHandler = new SimpleGameHandler(this.user.name);
    const game = gameRef.join(gameHandler);
    gameHandler.setGame(game);
    return game;
  }

  public playGame(game: GameConnection, deck: string[]): void {
    game.play(deck);
  }

  public onConnect(user: User): void { }

  public onDisconnect(user: User): void { }

  public onGameAdd(game: Game): void { }

  public onGameDelete(game: Game): void { }

  public onGameStatus(game: Game): void { }

}
