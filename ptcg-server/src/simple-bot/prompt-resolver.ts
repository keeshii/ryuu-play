import { Player, State, Action, EnergyMap, PokemonCardList,  PlayerType,
  SlotType, StateUtils, AlertPrompt, ConfirmPrompt, Prompt, ChooseEnergyPrompt,
  ChoosePokemonPrompt, ChoosePrizePrompt, ShowCardsPrompt, ResolvePromptAction,
  InvitePlayerPrompt, GameMessage, ChooseCardsPrompt, StateLog, Card,
  SelectPrompt, CardList, OrderCardsPrompt} from '../game';


export class PromptResolver {

  constructor(private deck: string[] | null) { }

  public resolvePrompt(player: Player, state: State, prompt: Prompt<any>): Action | undefined {
    if (prompt instanceof AlertPrompt || prompt instanceof ShowCardsPrompt) {
      return new ResolvePromptAction(prompt.id, 0);
    }

    if (prompt instanceof InvitePlayerPrompt) {
      const result = this.deck;
      let log: StateLog | undefined;
      if (result === null) {
        log = new StateLog('Sorry, my deck is not ready.', [], player.id);
      }

      return new ResolvePromptAction(prompt.id, result, log);
    }

    if (prompt instanceof SelectPrompt) {
      const result = 0;
      return new ResolvePromptAction(prompt.id, result);
    }

    if (prompt instanceof ConfirmPrompt) {
      if (prompt.message === GameMessage.SETUP_OPPONENT_NO_BASIC) {
        const result = player.hand.cards.length < 15;
        return new ResolvePromptAction(prompt.id, result);
      }
      return new ResolvePromptAction(prompt.id, false);
    }

    if (prompt instanceof OrderCardsPrompt) {
      if (prompt.options.allowCancel) {
        return new ResolvePromptAction(prompt.id, null);
      }
      const result: number[] = [];
      prompt.cards.cards.forEach((c, index) => result.push(index));
      return new ResolvePromptAction(prompt.id, result);
    }

    if (prompt instanceof ChooseCardsPrompt) {
      let result: Card[] | null = this.buildCardsToChoose(state, prompt);
      if (result.length > prompt.options.max) {
        result.length = prompt.options.max;
      }
      if (result.length < prompt.options.min) {
        result = null;
      }
      return new ResolvePromptAction(prompt.id, result);
    }

    if (prompt instanceof ChooseEnergyPrompt) {
      const result: EnergyMap[] = prompt.energy.slice();
      while (result.length > 0 && !StateUtils.checkExactEnergy(result, prompt.cost)) {
        result.splice(result.length - 1, 1);
      }
      return new ResolvePromptAction(prompt.id, result);
    }

    if (prompt instanceof ChoosePokemonPrompt) {
      const result: PokemonCardList[] = this.buildPokemonToChoose(state, prompt)
        .slice(0, prompt.options.min);
      return new ResolvePromptAction(prompt.id, result);
    }

    if (prompt instanceof ChoosePrizePrompt) {
      const result = player.prizes.filter(p => p.cards.length > 0)
        .slice(0, prompt.options.count);
      return new ResolvePromptAction(prompt.id, result);
    }

    // Unknown prompt type. Try to cancel it.
    return new ResolvePromptAction(prompt.id, null);
  }

  private buildCardsToChoose(state: State, prompt: ChooseCardsPrompt): Card[] {
    const cardList = new CardList();
    cardList.cards = prompt.cards.cards
      .filter((card, index) => !prompt.options.blocked.includes(index));
    const cards: Card[] = prompt.cards.filter(prompt.filter);
    return cards;
  }

  private buildPokemonToChoose(state: State, prompt: ChoosePokemonPrompt): PokemonCardList[] {
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

    const blocked = prompt.options.blocked.map(b => StateUtils.getTarget(state, player, b));
    result = result.filter(r => !blocked.includes(r));
    return result;
  }


}
