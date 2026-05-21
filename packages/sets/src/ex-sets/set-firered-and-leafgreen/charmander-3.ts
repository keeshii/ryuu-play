import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Charmander3 extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Flare',
      cost: [CardType.FIRE],
      damage: '10',
      text: ''
    },
    {
      name: 'Rage',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '10+',
      text: 'Does 10 damage plus 10 more damage for each damage counter on Charmander.'
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Charmander';

  public fullName: string = 'Charmander RG-3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      effect.damage += player.active.damage;
    }

    return state;
  }
}
