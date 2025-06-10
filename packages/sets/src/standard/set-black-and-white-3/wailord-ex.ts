import {
  AddSpecialConditionsEffect,
  AttachEnergyEffect,
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
  StoreLike,
} from '@ptcg/common';

export class WailordEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 250;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Water Veil',
      powerType: PowerType.ABILITY,
      text:
        'Whenever you attach an Energy card from your hand to this ' +
        'Pokémon, remove all Special Conditions from it.',
    },
  ];

  public attacks = [
    {
      name: 'High Breaching',
      cost: [CardType.WATER, CardType.WATER, CardType.WATER, CardType.WATER, CardType.WATER],
      damage: '120',
      text: 'This Pokémon is now Asleep.',
    },
  ];

  public set: string = 'BW3';

  public name: string = 'Wailord EX';

  public fullName: string = 'Wailord EX PCL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      specialConditionEffect.target = effect.player.active;
      store.reduceEffect(state, specialConditionEffect);
      return state;
    }

    if (effect instanceof AttachEnergyEffect && effect.target.pokemons.cards.includes(this)) {
      const player = effect.player;
      if (effect.target.specialConditions.length === 0) {
        return state;
      }
      const pokemonCard = effect.target.getPokemonCard();
      if (pokemonCard !== this) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      const conditions = effect.target.specialConditions.slice();
      conditions.forEach(condition => {
        effect.target.removeSpecialCondition(condition);
      });
    }

    return state;
  }
}
