import { Bot, Main, Game } from '../game';
import { Prompt } from '../game/store/promts/prompt';
import { State } from '../game/store/state/state';
import { StoreHandler } from '../game/store/store-handler';
import { User } from '../storage';

export class SimpleBot implements Bot, StoreHandler {

  constructor(
    public user: User,
    public main: Main
  ) { }

  public createGame(): Game {
    return this.main.createGame(this.user);
  }

  public joinGame(table: Game): void {
    table.join(this.user, this);
  }

  public playGame(game: Game, deck: string[]): void {
    game.play(this.user, deck);
  }

  public onStateChange(state: State): void { }

  public resolvePrompt(prompt: Prompt<any>): boolean {
    return false;
  }

}
