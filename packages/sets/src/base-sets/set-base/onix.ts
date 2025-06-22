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

export class Onix extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIGHTING];

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
        'Resistance), prevent that damage. (Any other effects of attacks still happen.)'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Onix';

  public fullName: string = 'Onix BS';

  public readonly HARDEN_MARKER = 'HARDEN_MARKER';
  
  public readonly CLEAR_HARDEN_MARKER = 'CLEAR_HARDEN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const opponentNextTurn = commonMarkers.duringOpponentNextTurn(this, store, state, effect);

    if (effect instanceof PutDamageEffect && opponentNextTurn.hasMarker(effect, effect.target)) {
      if (effect.damage <= 30) {
        effect.preventDefault = true;
      }
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      opponentNextTurn.setMarker(effect, effect.player.active);
      return state;
    }

    return state;
  }
}
