import {
  AttackEffect,
  CardType,
  Effect,
  GameError,
  GameMessage,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonMarkers } from '../../common';

export class Slakoth extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 40;

  public attacks = [
    {
      name: 'Lazy Punch',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: 'Slakoth can\'t attack during your next turn.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Slakoth';

  public fullName: string = 'Slakoth SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const duringYourNextTurn = commonMarkers.duringYourNextTurn(this, store, state, effect);

    if (effect instanceof AttackEffect && duringYourNextTurn.hasMarker(effect)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      duringYourNextTurn.setMarker(effect);
      return state;
    }

    return state;
  }
}
