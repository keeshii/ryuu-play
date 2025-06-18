import {
  AbstractAttackEffect,
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

import { commonMarkers } from '../../common';

export class Fearow extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Spearow';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Agility',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text:
        'Flip a coin. If heads, during your opponent\'s next turn, prevent all effects of attacks, including damage, ' +
        'done to Fearow.'
    },
    {
      name: 'Drill Peck',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [];

  public set: string = 'JU';

  public name: string = 'Fearow';

  public fullName: string = 'Fearow JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    const opponentNextTurn = commonMarkers.duringOpponentNextTurn(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          opponentNextTurn.setMarker(effect, player.active);
        }
      });
    }

    if (effect instanceof AbstractAttackEffect && opponentNextTurn.hasMarker(effect, effect.target)) {
      effect.preventDefault = true;
      return state;
    }

    return state;
  }
}
