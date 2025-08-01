import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonMarkers } from '../../common';

export class Vigoroth extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Slakoth';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Focus Energy',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'During your next turn, base damage of Vigoroth\'s Slash is attack is 90 instead of 40.'
    },
    {
      name: 'Slash',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Vigoroth';

  public fullName: string = 'Vigoroth SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const duringYourNextTurn = commonMarkers.duringYourNextTurn(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      duringYourNextTurn.setMarker(effect);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      if (duringYourNextTurn.hasMarker(effect)) {
        effect.damage = 90;
      }
      return state;
    }

    return state;
  }
}
