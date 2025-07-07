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

export class Wingull extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 40;

  public attacks = [
    {
      name: 'Supersonic',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Wingull';

  public fullName: string = 'Wingull SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const flipSpecialConditions = commonAttacks.flipSpecialConditions(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return flipSpecialConditions.use(effect, [SpecialCondition.CONFUSED]);
    }

    return state;
  }
}
