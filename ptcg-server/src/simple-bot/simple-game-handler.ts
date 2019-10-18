import { Action } from '../game/store/actions/action';
import { AlertPrompt, ConfirmPrompt, Player, Prompt, State, GamePhase } from '../game';
import { ChooseCardsPrompt } from '../game/store/prompts/choose-cards-prompt';
import { PassTurnAction } from '../game/store/actions/pass-turn-action';
import { StoreMessage } from '../game/store/store-messages';
import { GameRoom } from '../game/core/game-room';
import { RoomClient } from '../game/core/room-client';

export class SimpleGameHandler {

  // private state: State;
  private player: Player = new Player();
  private name: string;

  constructor(private client: RoomClient<GameRoom>) {
    this.name = client.user.name;

    client.on('game:stateStable', (state: State) => this.onStateStable(state));
    client.on('game:stateChange', (state: State) => this.onStateChange(state));
    client.on('game:prompt', (prompt: Prompt<any>) => this.resolvePrompt(prompt));
  }

  private onStateStable(state: State): void {
    if (state.phase !== GamePhase.PLAYER_TURN) {
      return;
    }

    const player = state.players[state.activePlayer];
    if (player.name !== this.name) {
      return;
    }

    this.dispatch(new PassTurnAction(player));
  }

  private onStateChange(state: State): void {
    for (let i = 0; i < state.players.length; i++) {
      if (state.players[i].name === this.name) {
        this.player = state.players[i];
      }
    }
  }

  private resolvePrompt(prompt: Prompt<any>): boolean {
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

    if (prompt instanceof ChooseCardsPrompt) {
      const cards = prompt.cards.filter(prompt.filter);
      if (cards.length > prompt.options.max) {
        cards.length = prompt.options.max;
      }
      prompt.resolve(cards);
      return true;
    }

    return false;
  }

  private dispatch(action: Action): void {
    this.client.emit('game:action', action);
  }

}
