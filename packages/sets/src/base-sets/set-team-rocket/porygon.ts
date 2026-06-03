import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks } from '../../common';

export class Porygon extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 40;

  public attacks = [
    {
      name: 'Conversion 1',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'If the Defending Pokémon has a Weakness, you may change it to a type of your choice other than C.'
    },
    {
      name: 'Psybeam',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [];

  public set: string = 'TR';

  public name: string = 'Porygon';

  public fullName: string = 'Porygon TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const conversion1And2 = commonAttacks.conversion1And2(this, store, state, effect);
    const flipSpecialConditions = commonAttacks.flipSpecialConditions(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return conversion1And2.use(effect, 1);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return flipSpecialConditions.use(effect, [SpecialCondition.CONFUSED]);
    }

    return state;
  }
}
