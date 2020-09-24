import { Player, State, PassTurnAction, Action, PokemonCard, Stage, EnergyMap,
  PokemonCardList, PlayCardAction, CardTarget, PlayerType, SlotType, EnergyCard,
  CardType, StateUtils, AttackAction, SpecialCondition, AlertPrompt,
  ConfirmPrompt, Prompt, GamePhase, ChooseEnergyPrompt, ChoosePokemonPrompt,
  ChoosePrizePrompt, ShowCardsPrompt, ResolvePromptAction, InvitePlayerPrompt,
  GameMessage, ChooseCardsPrompt, StateLog, Card } from '../game';
import { Client } from '../game/client/client.interface';

export enum SimpleTactics {
  PLAY_BASIC_POKEMON,
  ATTACH_ENERGY_CARD,
  USE_BEST_ATTACK
}

export const allSimpleTactics = [
  SimpleTactics.PLAY_BASIC_POKEMON,
  SimpleTactics.ATTACH_ENERGY_CARD,
  SimpleTactics.USE_BEST_ATTACK
];

export class SimpleTacticsAi {

  private tactics: SimpleTactics[];
  private deck: string[] | null;

  constructor(
    private client: Client,
    deck: string[] | null,
    tactics: SimpleTactics[] = allSimpleTactics
  ) {
    this.tactics = tactics;
    this.deck = deck;
  }

  public decodeNextAction(state: State): Action | undefined {
    let player: Player | undefined;
    for (let i = 0; i < state.players.length; i++) {
      if (state.players[i].id === this.client.id) {
        player = state.players[i];
      }
    }

    if (player !== undefined && state.prompts.length > 0) {
      const playerId = player.id;
      const prompt = state.prompts.find(p => p.playerId === playerId && p.result === undefined);
      if (prompt !== undefined) {
        return this.resolvePrompt(player, state, prompt);
      }
    }

    // Wait for other players to resolve the prompts.
    if (state.prompts.filter(p => p.result === undefined).length > 0) {
      return;
    }

    const activePlayer = state.players[state.activePlayer];
    const isMyTurn = activePlayer.id === this.client.id;
    if (state.phase === GamePhase.PLAYER_TURN && isMyTurn) {
      return this.decodePlayerTurnAction(player, state);
    }
  }

  private decodePlayerTurnAction(player: Player | undefined, state: State): Action {
    if (player === undefined) {
      return new PassTurnAction(this.client.id);
    }

    const action
      = this.playBasicPokemon(player, state)
      || this.attachEnergyCard(player, state)
      || this.useBestAttack(player, state)
      || new PassTurnAction(this.client.id);

    return action;
  }

  private resolvePrompt(player: Player, state: State, prompt: Prompt<any>): Action | undefined {
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

    if (prompt instanceof ConfirmPrompt) {
      if (prompt.message === GameMessage.SETUP_OPPONENT_NO_BASIC) {
        const result = player.hand.cards.length < 15;
        return new ResolvePromptAction(prompt.id, result);
      } else {
        return new ResolvePromptAction(prompt.id, false);
      }
      return;
    }

    if (prompt instanceof ChooseCardsPrompt) {
      let result: Card[] | null = prompt.cards.filter(prompt.filter);
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
    return result;
  }

  private playBasicPokemon(player: Player, state: State): Action | undefined {
    if (!this.tactics.includes(SimpleTactics.PLAY_BASIC_POKEMON)) {
      return undefined;
    }

    const basicPokemon = player.hand.cards
      .find(c => c instanceof PokemonCard && c.stage === Stage.BASIC);

    const emptyBenchSlot = player.bench
      .find(b => b.cards.length === 0);

    try {
      if (basicPokemon && emptyBenchSlot) {
        return new PlayCardAction(
          this.client.id,
          player.hand.cards.indexOf(basicPokemon),
          this.getCardTarget(player, state, emptyBenchSlot)
        );
      }
    } catch (error) { }
  }

  private useBestAttack(player: Player, state: State): Action | undefined {
    if (!this.tactics.includes(SimpleTactics.USE_BEST_ATTACK)) {
      return undefined;
    }

    const sp = player.active.specialConditions;
    if (sp.includes(SpecialCondition.PARALYZED) || sp.includes(SpecialCondition.ASLEEP)) {
      return undefined;
    }

    const active = player.active.getPokemonCard();
    if (!active) {
      return undefined;
    }

    for (let i = active.attacks.length - 1; i >= 0; i--) {
      const attack = active.attacks[i];

      const energy: EnergyMap[] = [];
      player.active.cards.forEach(card => {
        if (card instanceof EnergyCard) {
          energy.push({ card, provides: card.provides });
        }
      });

      if (StateUtils.checkEnoughEnergy(energy, attack.cost)) {
        return new AttackAction(this.client.id, attack.name);
      }
    }
  }

  private attachEnergyCard(player: Player, state: State): Action | undefined {
    if (!this.tactics.includes(SimpleTactics.ATTACH_ENERGY_CARD)) {
      return undefined;
    }
    if (player.energyPlayedTurn >= state.turn) {
      return undefined;
    }

    const pokemons = [ player.active, ...player.bench ]
      .filter(p => p.cards.length > 0);

    for (let i = 0; i < pokemons.length; i++) {
      const cardList = pokemons[i];
      const missing = this.getMissingEnergies(cardList);

      for (let j = 0; j < missing.length; j++) {
        const cardType = missing[j];
        const index = player.hand.cards.findIndex(c => {
          if (c instanceof EnergyCard) {
            const isColorless = cardType === CardType.ANY && c.provides.length > 0;
            const isMatch = c.provides.includes(cardType);
            if (isColorless || isMatch) {
              return true;
            }
          }
        });
        try {
          if (index !== -1) {
            return new PlayCardAction(
              this.client.id,
              index,
              this.getCardTarget(player, state, cardList)
            );
          }
        } catch (error) { }
      }
    }
  }

  private getMissingEnergies(cardList: PokemonCardList): CardType[] {
    const pokemon = cardList.getPokemonCard();
    if (pokemon === undefined || pokemon.attacks.length === 0) {
      return [];
    }

    const cost = pokemon.attacks[pokemon.attacks.length - 1].cost;
    if (cost.length === 0) {
      return [];
    }

    const provided: CardType[] = [];
    cardList.cards.forEach(card => {
      if (card instanceof EnergyCard) {
        card.provides.forEach(energy => provided.push(energy));
      }
    });

    const missing: CardType[] = [];
    let colorless = 0;
    // First remove from array cards with specific energy types
    cost.forEach(costType => {
      switch (costType) {
        case CardType.ANY:
        case CardType.NONE:
          break;
        case CardType.COLORLESS:
          colorless += 1;
          break;
        default:
          const index = provided.findIndex(energy => energy === costType);
          if (index !== -1) {
            provided.splice(index, 1);
          } else {
            missing.push(costType);
          }
      }
    });

    for (let i = 0; i < colorless; i++) {
      missing.push(CardType.ANY);
    }

    return missing;
  }

  private getCardTarget(player: Player, state: State, target: PokemonCardList): CardTarget {
    if (target === player.active) {
      return { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
    }

    for (let index = 0; index < player.bench.length; index++) {
      if (target === player.bench[index]) {
        return { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index };
      }
    }

    const opponent = state.players.find(p => p !== player);
    if (opponent === undefined) {
      throw new Error('No opponent');
    }

    if (target === opponent.active) {
      return { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 };
    }

    for (let index = 0; index < opponent.bench.length; index++) {
      if (target === opponent.bench[index]) {
        return { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index };
      }
    }

    throw new Error('Invalid target');
  }

}
