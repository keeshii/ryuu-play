import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardTag,
  CardType,
  Effect,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class ToxicroakEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 170;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Triple Poison',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'Your opponent\'s Active Pokémon is now Poisoned. Put 3 damage ' +
        'counters instead of 1 on that Pokémon between turns.',
    },
    {
      name: 'Smash Uppercut',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
      damage: '80',
      text: 'This attack\'s damage isn\'t affected by Resistance.',
    },
  ];

  public set: string = 'BW2';

  public name: string = 'Toxicroak EX';

  public fullName: string = 'Toxicroak EX FLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      specialCondition.poisonDamage = 30;
      return store.reduceEffect(state, specialCondition);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      effect.ignoreResistance = true;
    }

    return state;
  }
}
