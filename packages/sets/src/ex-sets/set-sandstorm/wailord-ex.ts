import {
  AttackEffect,
  CardTag,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class WailordEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Wailmer';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 200;

  public attacks = [
    {
      name: 'Super Deep Dive',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'If you don\'t have any Benched Pokémon, this attack does nothing. Remove 3 damage counters from Wailord ex. ' +
        'Switch Wailord ex with 1 of your Benched Pokémon.'
    },
    {
      name: 'Dwindling Wave',
      cost: [CardType.WATER, CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: '100-',
      text: 'Does 100 damage minus 10 damage for each damage counter on Wailord ex.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS },
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Wailord ex';

  public fullName: string = 'Wailord ex SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return state;
    }

    return state;
  }
}
