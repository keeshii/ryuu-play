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

export class Cubone extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 40;

  public attacks = [
    {
      name: 'Snivel',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'If the Defending Pokémon attacks Cubone during your opponent\'s next turn, any damage done by the attack is ' +
        'reduced by 20 (after applying Weakness and Resistance). (Benching either Pokémon ends this effect.)'
    },
    {
      name: 'Rage',
      cost: [CardType.FIGHTING, CardType.FIGHTING],
      damage: '10+',
      text: 'Does 10 damage plus 10 more damage for each damage counter on Cubone.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public resistance = [
    { type: CardType.LIGHTNING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Cubone';

  public fullName: string = 'Cubone JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    const opponentNextTurn = commonMarkers.duringOpponentNextTurn(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponentNextTurn.setMarker(effect, player.active);
      opponentNextTurn.setMarker(effect, opponent.active);
      return state;
    }

    if (effect instanceof PutDamageEffect
      && opponentNextTurn.hasMarker(effect, effect.player.active)
      && opponentNextTurn.hasMarker(effect, effect.target)) {
      effect.damage = Math.max(0, effect.damage - 20);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      effect.damage += effect.player.active.damage;
      return state;
    }

    return state;
  }
}
