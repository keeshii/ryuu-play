import {
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameError,
  GameMessage,
  PokemonCard,
  Stage,
  State,
  StateUtils,
  StoreLike,
  UseAttackEffect,
} from '@ptcg/common';

import { commonMarkers } from '../../common';

export class Rhyhorn extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Leer',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Flip a coin. If heads, the Defending Pokémon can\'t attack Rhyhorn during your opponent\'s next turn. ' +
        '(Benching either Pokémon ends this effect.)'
    },
    {
      name: 'Horn Attack',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public resistance = [
    { type: CardType.LIGHTNING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Rhyhorn';

  public fullName: string = 'Rhyhorn JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    const opponentNextTurn = commonMarkers.duringOpponentNextTurn(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          opponentNextTurn.setMarker(effect, player.active);
          opponentNextTurn.setMarker(effect, opponent.active);
        }
      });
    }

    if (effect instanceof UseAttackEffect && opponentNextTurn.hasMarker(effect, effect.player.active)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!opponentNextTurn.hasMarker(effect, opponent.active)) {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    return state;
  }
}
