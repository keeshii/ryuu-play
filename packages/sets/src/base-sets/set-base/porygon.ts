import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike
} from '@ptcg/common';

import { commonAttacks } from '../../common';

export class Porygon extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 30;

  public attacks = [
    {
      name: 'Conversion 1',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'If the Defending Pokémon has a Weakness, you may change it to a type of your choice other than Colorless.'
    },
    {
      name: 'Conversion 2',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text: 'Change Porygon\'s Resistance to a type of your choice other than Colorless.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Porygon';

  public fullName: string = 'Porygon BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const conversion1And2 = commonAttacks.conversion1And2(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return conversion1And2.use(effect, 1);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return conversion1And2.use(effect, 2);
    }

    return state;
  }
}
