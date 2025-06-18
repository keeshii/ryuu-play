import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks } from '../../common';

export class Bellsprout extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 40;

  public attacks = [
    {
      name: 'Vine Whip',
      cost: [CardType.GRASS],
      damage: '10',
      text: ''
    },
    {
      name: 'Call for Family',
      cost: [CardType.GRASS],
      damage: '',
      text:
        'Search your deck for a Basic Pokémon named Bellsprout and put it onto your Bench. Shuffle your deck ' +
        'afterward. (You can\'t use this attack if your Bench is full.)'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Bellsprout';

  public fullName: string = 'Bellsprout JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const callForFamily = commonAttacks.callForFamily(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return callForFamily.use(effect, { name: 'Bellsprout' });
    }

    return state;
  }
}
