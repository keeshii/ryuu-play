import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Dustox extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Cascoon';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 90;

  public powers = [
    {
      name: 'Protective Dust',
      powerType: PowerType.POKEBODY,
      text: 'Prevent all effects of attacks, except damage, done to Dustox by the Attacking Pokémon.'
    },
  ];

  public attacks = [
    {
      name: 'Toxic',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: '',
      text:
        'The Defending Pokémon is now Poisoned. Put 2 damage counters instead of 1 on the Defending Pokémon between ' +
        'turns. '
    },
    {
      name: 'Gust',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [];

  public set: string = 'RS';

  public name: string = 'Dustox';

  public fullName: string = 'Dustox RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
