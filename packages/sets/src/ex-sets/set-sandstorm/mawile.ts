import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Mawile extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.METAL];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Scam',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Look at your opponent\'s hand. You may have your opponent shuffle a Supporter card you find there into his ' +
        'or her deck. If you do, your opponent draws a card.'
    },
    {
      name: 'Metal Hook',
      cost: [CardType.METAL, CardType.COLORLESS],
      damage: '20',
      text:
        'Before doing damage, you may switch 1 of your opponent\'s Benched Pokémon with 1 of the Defending Pokémon. ' +
        'If you do, this attack does 20 damage to the new Defending Pokémon.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Mawile';

  public fullName: string = 'Mawile SS';

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
