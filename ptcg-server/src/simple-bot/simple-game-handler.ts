import { Action } from '../game/store/actions/action';
import { AlertPrompt, ConfirmPrompt, Player, Prompt, State, GamePhase,
  GameOverPrompt, ChooseEnergyPrompt, StateUtils, Card, EnergyCard,
  ChoosePokemonPrompt, PokemonCardList, PlayerType, SlotType,
  ChoosePrizePrompt } from '../game';
import { ChooseCardsPrompt } from '../game/store/prompts/choose-cards-prompt';
import { Client } from '../game/core/client';
import { Game } from '../game/core/game';
import { ResolvePromptAction } from '../game/store/actions/resolve-prompt-action';
import { GameMessage } from '../game/game-error';
import { SimpleTacticsAi } from './simple-tactics-ai';

export class SimpleGameHandler {

  private player: Player = new Player();
  private ai: SimpleTacticsAi;

  constructor(private client: Client, public game: Game) {
    this.ai = new SimpleTacticsAi(this.client);
  }

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

    // Wait for other players to resolve the prompts.
    if (state.prompts.filter(p => p.result === undefined).length > 0) {
      return;
    }

    const activePlayer = state.players[state.activePlayer];
    const isMyTurn = activePlayer.id === this.client.id;
    if (state.phase === GamePhase.PLAYER_TURN && isMyTurn) {
      const action = this.ai.decodeNextAction(state);
      this.dispatch(action);
      return;
    }
  }

  public resolvePrompt(prompt: Prompt<any>): void {
    if (prompt instanceof AlertPrompt || prompt instanceof GameOverPrompt) {
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

    if (prompt instanceof ChooseEnergyPrompt) {
      const result: Card[] = prompt.cards.cards.filter(c => c instanceof EnergyCard);
      while (result.length > 0 && !StateUtils.checkExactEnergy(result, prompt.cost)) {
        result.splice(result.length - 1, 1);
      }
      this.dispatch(new ResolvePromptAction(prompt.id, result));
      return;
    }

    if (prompt instanceof ChoosePokemonPrompt) {
      const result: PokemonCardList[] = this.buildPokemonToChoose(prompt)
        .slice(0, prompt.options.count);
      this.dispatch(new ResolvePromptAction(prompt.id, result));
      return;
    }

    if (prompt instanceof ChoosePrizePrompt) {
      const result = this.player.prizes.filter(p => p.cards.length > 0)
        .slice(0, prompt.options.count);
      this.dispatch(new ResolvePromptAction(prompt.id, result));
      return;
    }
  }

  private buildPokemonToChoose(prompt: ChoosePokemonPrompt): PokemonCardList[] {
    const state = this.game.state;
    const player = state.players.find(p => p.id === prompt.playerId);
    const opponent = state.players.find(p => p.id !== prompt.playerId);
    if (player === undefined || opponent === undefined) {
      return [];
    }
    const hasOpponent = [PlayerType.TOP_PLAYER, PlayerType.ANY].includes(prompt.playerType);
    const hasPlayer = [PlayerType.BOTTOM_PLAYER, PlayerType.ANY].includes(prompt.playerType);
    const hasBench = prompt.slots.includes(SlotType.BENCH);
    const hasActive = prompt.slots.includes(SlotType.ACTIVE);

    let result: PokemonCardList[] = [];
    if (hasOpponent && hasBench) {
      opponent.bench.filter(b => b.cards.length).forEach(b => result.push(b));
    }
    if (hasOpponent && hasActive) {
      result.push(opponent.active);
    }
    if (hasPlayer && hasActive) {
      result.push(player.active);
    }
    if (hasPlayer && hasBench) {
      player.bench.filter(b => b.cards.length).forEach(b => result.push(b));
    }
    return result;
  }

  public dispatch(action: Action): State {
    return this.game.dispatch(this.client, action);
  }

}
