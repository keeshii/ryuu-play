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

export class Shellder extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Minimize',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'During your opponent\'s next turn, any damage done to Shellder by attacks is reduced by 20 (after applying ' +
        'Weakness and Resistance).'
    },
    {
      name: 'Wave Splash',
      cost: [CardType.WATER],
      damage: '10',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Shellder';

  public fullName: string = 'Shellder RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const duringOpponentNextTurn = commonMarkers.duringOpponentNextTurn(this, store, state, effect);

    // Reduce damage by 20
    if (effect instanceof PutDamageEffect && duringOpponentNextTurn.hasMarker(effect, effect.target)) {
      effect.damage -= 20;
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      duringOpponentNextTurn.setMarker(effect, effect.player.active);
    }

    return state;
  }
}
