import { Player, State, PassTurnAction, Action, PokemonCard, Stage,
  PokemonCardList, PlayCardAction, CardTarget, PlayerType, SlotType, EnergyCard,
  CardType, StateUtils, AttackAction} from '../game';
import { Client } from '../game/core/client';

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

  constructor(private client: Client, tactics: SimpleTactics[] = allSimpleTactics) {
    this.tactics = tactics;
  }

  public decodeNextAction(state: State): Action {
    let player: Player | undefined;
    for (let i = 0; i < state.players.length; i++) {
      if (state.players[i].id === this.client.id) {
        player = state.players[i];
      }
    }

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

    const active = player.active.getPokemonCard();
    if (!active) {
      return undefined;
    }

    for (let i = active.attacks.length - 1; i >= 0; i--) {
      const attack = active.attacks[i];
      if (StateUtils.checkEnoughEnergy(player.active.cards, attack.cost)) {
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
