import {
  AttackEffect,
  CardTag,
  CardType,
  CheckRetreatCostEffect,
  Effect,
  PlayerType,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks } from '../../common';

export class Dodrio extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Doduo';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 70;

  public powers = [
    {
      name: 'Retreat Aid',
      powerType: PowerType.POKEBODY,
      text:
        'As long as Dodrio is on your Bench, you pay C C less to retreat your Active Pokémon ' +
        '(excluding Pokémon-ex and Baby Pokémon.)'
    },
  ];

  public attacks = [
    {
      name: 'Tri Attack',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20×',
      text: 'Flip 3 coins. This attack does 20 damage times the number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Dodrio';

  public fullName: string = 'Dodrio RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const flipDamageTimes = commonAttacks.flipDamageTimes(this, store, state, effect);

    if (effect instanceof CheckRetreatCostEffect) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (!pokemonCard || pokemonCard.tags.includes(CardTag.POKEMON_EX)) {
        return state;
      }

      let hasDodrioOnBench = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, pokemonCard) => {
        if (pokemonSlot !== player.active && pokemonCard === this) {
          hasDodrioOnBench = true;
        }
      });

      if (!hasDodrioOnBench) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      for (let i = 0; i < 2; i++) {
        const index = effect.cost.indexOf(CardType.COLORLESS);
        if (index !== -1) {
          effect.cost.splice(index, 1);
        }
      }

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return flipDamageTimes.use(effect, 3, 20);
    }

    return state;
  }
}
