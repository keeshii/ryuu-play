import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Onix extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 90;

  public attacks = [
    {
      name: 'Rock Throw',
      cost: [CardType.FIGHTING],
      damage: '10',
      text: ''
    },
    {
      name: 'Harden',
      cost: [CardType.FIGHTING, CardType.FIGHTING],
      damage: '',
      text:
        'During your opponent\'s next turn, whenever 30 or less damage is done to Onix (after applying Weakness and ' +
        'Resistance), prevent that damage. (Any other effects of attacks still happen.) '
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Onix';

  public fullName: string = 'Onix BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return state;
    }

    return state;
  }
}
