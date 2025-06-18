import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  PutDamageEffect,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

import { commonMarkers } from '../../common';

export class Persian extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Meowth';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Scratch',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: ''
    },
    {
      name: 'Pounce',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text:
        'If the Defending Pokémon attacks Persian during your next turn, any damage done by the attack is reduced ' +
        'by 10 (after applying Weakness and Resistance). (Benching either Pokémon ends this effect.)'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [];

  public set: string = 'JU';

  public name: string = 'Persian';

  public fullName: string = 'Persian JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    const opponentNextTurn = commonMarkers.duringOpponentNextTurn(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponentNextTurn.setMarker(effect, player.active);
      opponentNextTurn.setMarker(effect, opponent.active);
      return state;
    }

    if (effect instanceof PutDamageEffect
      && opponentNextTurn.hasMarker(effect, effect.player.active)
      && opponentNextTurn.hasMarker(effect, effect.target)) {
      effect.damage = Math.max(0, effect.damage - 10);
      return state;
    }

    return state;
  }
}
