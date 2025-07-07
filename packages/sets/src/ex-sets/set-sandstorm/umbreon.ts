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

export class Umbreon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Eevee';

  public cardTypes: CardType[] = [CardType.DARK];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Confuse Ray',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
    },
    {
      name: 'Moon Impact',
      cost: [CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Umbreon';

  public fullName: string = 'Umbreon SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const flipSpecialConditions = commonAttacks.flipSpecialConditions(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return flipSpecialConditions.use(effect, [SpecialCondition.CONFUSED]);
    }

    return state;
  }
}
