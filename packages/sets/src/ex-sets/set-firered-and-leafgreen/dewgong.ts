import {
  AbstractAttackEffect,
  AddSpecialConditionsEffect,
  AttackEffect,
  CardTag,
  CardType,
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

export class Dewgong extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Seel';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 80;

  public powers = [
    {
      name: 'Safeguard',
      powerType: PowerType.POKEBODY,
      text: 'Prevent all effects of attacks, including damage, done to Dewgong by your opponent\'s Pokémon-ex.'
    },
  ];

  public attacks = [
    {
      name: 'Cold Breath',
      cost: [CardType.WATER],
      damage: '10',
      text: 'The Defending Pokémon is now Asleep.'
    },
    {
      name: 'Aurora Beam',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.METAL }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Dewgong';

  public fullName: string = 'Dewgong RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AbstractAttackEffect && effect.target.pokemons.cards.includes(this)) {
      const target = effect.target;
      const targetPlayer = StateUtils.findOwner(state, target);

      if (target.getPokemonCard() !== this || effect.source === effect.target) {
        return state;
      }

      const pokemonCard = effect.source.getPokemonCard();
      if (!pokemonCard || !pokemonCard.tags.includes(CardTag.POKEMON_EX)) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(targetPlayer, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      effect.preventDefault = true;
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}
