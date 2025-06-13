import {
  CardType,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Armaldo extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Anorith';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 120;

  public powers = [
    {
      name: 'Primal Veil',
      powerType: PowerType.POKEBODY,
      text: 'As long as Armaldo is your Active Pokémon, each player can\'t play any Supporter Cards.'
    },
  ];

  public attacks = [
    {
      name: 'Blade Arms',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: '60',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Armaldo';

  public fullName: string = 'Armaldo SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      return state;
    }

    return state;
  }
}
