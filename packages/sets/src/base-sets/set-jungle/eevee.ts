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

export class Eevee extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Tail Wag',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Flip a coin. If heads, the Defending Pokémon can\'t attack Eevee during your opponent\'s next turn. ' +
        '(Benching either Pokémon ends this effect.)'
    },
    {
      name: 'Quick Attack',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '10+',
      text:
        'Flip a coin. If heads, this attack does 10 damage plus 20 more damage; if tails, this attack does 10 ' +
        'damage.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Eevee';

  public fullName: string = 'Eevee JU';

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


    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          effect.damage += 20;
        }
      });
    }

    return state;
  }
}
