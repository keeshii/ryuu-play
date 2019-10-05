import { Bot, Main, MainConnection, MainHandler, Game, GameConnection, GameHandler } from '../game';
import { Prompt } from '../game/store/promts/prompt';
import { State } from '../game/store/state/state';
import { User } from '../storage';

export class SimpleBot implements Bot, GameHandler, MainHandler {

  private connection: MainConnection;

  constructor(
    public user: User,
    public main: Main
  ) {
    this.connection = main.connect(user, this);
  }

  public createGame(): GameConnection {
    return this.connection.createGame(this);
  }

  public joinGame(gameId: number): GameConnection {
    const gameRef = this.connection.getGame(gameId);
    if (gameRef === undefined) {
      throw new Error('Invalid game id');
    }
    return gameRef.join(this);
  }

  public playGame(game: GameConnection, deck: string[]): void {
    game.play(deck);
  }

  public onConnect(user: User): void { }

  public onDisconnect(user: User): void { }

  public onGameAdd(game: Game): void { }

  public onGameDelete(game: Game): void { }

  public onGameStatus(game: Game): void { }

  public onJoin(user: User): void { }

  public onLeave(user: User): void { }

  public onStateChange(state: State): void { }

  public resolvePrompt(prompt: Prompt<any>): boolean {
    return false;
  }

}
