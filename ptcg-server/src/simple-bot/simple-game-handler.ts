import { Action } from '../game/store/actions/action';
import { AlertPrompt, ConfirmPrompt, Player, Prompt, State, GamePhase } from '../game';
import { ChooseCardsPrompt } from '../game/store/prompts/choose-cards-prompt';
import { Client } from '../game/core/client';
import { Game } from '../game/core/game';
import { PassTurnAction } from '../game/store/actions/game-actions';
import { ResolvePromptAction } from '../game/store/actions/resolve-prompt-action';
import { GameMessage } from '../game/game-error';

export class SimpleGameHandler {

  private player: Player = new Player();

  constructor(private client: Client, public game: Game) { }

  public onStateChange(state: State): void {
    for (let i = 0; i < state.players.length; i++) {
      if (state.players[i].id === this.client.id) {
        this.player = state.players[i];
      }
    }

    if (state.prompts.length > 0) {
      const prompt = state.prompts.find(p => p.playerId === this.player.id && p.result === undefined);
      if (prompt !== undefined) {
        this.resolvePrompt(prompt);
        return;
      }
    }

    const activePlayer = state.players[state.activePlayer];
    const isMyTurn = activePlayer.id === this.client.id;
    if (state.phase === GamePhase.PLAYER_TURN && isMyTurn) {
      this.dispatch(new PassTurnAction(this.client.id));
      return;
    }
  }

  public resolvePrompt(prompt: Prompt<any>): void {
    if (prompt instanceof AlertPrompt) {
      this.dispatch(new ResolvePromptAction(prompt.id, 0));
      return;
    }

    if (prompt instanceof ConfirmPrompt) {
      if (prompt.message === GameMessage.SETUP_OPPONENT_NO_BASIC) {
        const result = this.player.hand.cards.length < 15;
        this.dispatch(new ResolvePromptAction(prompt.id, result));
      } else {
        this.dispatch(new ResolvePromptAction(prompt.id, false));
      }
      return;
    }

    if (prompt instanceof ChooseCardsPrompt) {
      const result = prompt.cards.filter(prompt.filter);
      if (result.length > prompt.options.max) {
        result.length = prompt.options.max;
      }
      this.dispatch(new ResolvePromptAction(prompt.id, result));
      return;
    }
  }

  public dispatch(action: Action): State {
    return this.game.dispatch(this.client, action);
  }

}
