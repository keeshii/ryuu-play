import { AlertPrompt, ConfirmPrompt, GameHandler, Player, Prompt, State } from '../game';
import { StoreMessage } from '../game/store/store-messages';
import { User } from '../storage';

export class SimpleGameHandler implements GameHandler {

  // private state: State;
  private player: Player = new Player();

  constructor(private name: string) {
    // this.state = new State();
  }

  public onJoin(user: User): void { }

  public onLeave(user: User): void { }

  public onStateChange(state: State): void {
    for (let i = 0; i < state.players.length; i++) {
      if (state.players[i].name === this.name) {
        this.player = state.players[i];
      }
    }
  }

  public resolvePrompt(prompt: Prompt<any>): boolean {
    if (prompt instanceof AlertPrompt) {
      prompt.resolve(void 0);
      return true;
    }

    if (prompt instanceof ConfirmPrompt) {
      if (prompt.message === StoreMessage.SETUP_OPPONENT_NO_BASIC) {
        prompt.resolve(this.player.hand.cards.length < 15);
      } else {
        prompt.resolve(false);
      }
      return true;
    }

    return false;
  }

}
