import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Lairon2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Aron';

  public cardType: CardType = CardType.METAL;

  public hp: number = 80;

  public attacks = [
    {
      name: 'Magnitude',
      cost: [CardType.METAL],
      damage: '20',
      text:
        'Does 10 damage to each Benched Pokémon (both yours and your opponent\'s). (Don\'t apply Weakness and ' +
        'Resistance for Benched Pokémon.) '
    },
    {
      name: 'One-Two Strike',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30+',
      text: 'Flip 2 coins. This attack does 30 damage plus 20 more damage for each heads.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public resistance = [
    { type: CardType.GRASS, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Lairon';

  public fullName: string = 'Lairon RS-2';

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
