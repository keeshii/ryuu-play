import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CheckRetreatCostEffect,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class DarkMuk extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Grimer';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 60;

  public powers = [
    {
      name: 'Sticky Goo',
      powerType: PowerType.POKEPOWER,
      text:
        'As long as Dark Muk is your Active Pokémon, your opponent pays C C more to retreat his or ' +
        'her Active Pokémon. This power stops working while Dark Muk is Asleep, Confused, or Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Sludge Punch',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: '20',
      text: 'The Defending Pokémon is now Poisoned.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Muk';

  public fullName: string = 'Dark Muk TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckRetreatCostEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.getPokemonCard() !== this) {
        return state;
      }

      if (opponent.active.specialConditions.includes(SpecialCondition.ASLEEP)
        || opponent.active.specialConditions.includes(SpecialCondition.CONFUSED)
        || opponent.active.specialConditions.includes(SpecialCondition.PARALYZED)) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      effect.cost.push(CardType.COLORLESS, CardType.COLORLESS);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}
