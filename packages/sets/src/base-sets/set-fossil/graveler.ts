import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  PutDamageEffect,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

import { commonMarkers } from '../../common';

export class Graveler extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Geodude';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Harden',
      cost: [CardType.FIGHTING, CardType.FIGHTING],
      damage: '',
      text:
        'During your opponent\'s next turn, whenever 30 or less damage is done to Graveler (after applying Weakness ' +
        'and Resistance), prevent that damage. (Any other effects of attacks still happen.)'
    },
    {
      name: 'Rock Throw',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: '40',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Graveler';

  public fullName: string = 'Graveler FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    const opponentNextTurn = commonMarkers.duringOpponentNextTurn(this, store, state, effect);

    if (effect instanceof PutDamageEffect && opponentNextTurn.hasMarker(effect, effect.target)) {
      if (effect.damage <= 30) {
        effect.preventDefault = true;
      }
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      opponentNextTurn.setMarker(effect, effect.player.active);
      return state;
    }

    return state;
  }
}
