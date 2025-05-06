import { PokemonCard } from '@ptcg/common';
import { Stage, CardType } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { AttackEffect, UseAttackEffect } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';
import { GameError } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { CheckProvidedEnergyEffect } from '@ptcg/common';
import { EndTurnEffect } from '@ptcg/common';

export class Cobalion extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.METAL;

  public hp: number = 120;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [{
    name: 'Energy Press',
    cost: [ CardType.METAL, CardType.COLORLESS ],
    damage: 20,
    text: 'Does 20 more damage for each Energy attached to ' +
      'the Defending Pokemon.'
  }, {
    name: 'Iron Breaker',
    cost: [ CardType.METAL, CardType.METAL, CardType.COLORLESS ],
    damage: 80,
    text: 'The Defending Pokemon can\'t attack during your opponent\'s ' +
      'next turn.'
  }];

  public set: string = 'BW2';

  public name: string = 'Cobalion';

  public fullName: string = 'Cobalion LT';

  public readonly METAL_LINKS_MAREKER = 'IRON_BREAKER_MAREKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Energy Press
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, checkProvidedEnergyEffect);
      const energyCount = checkProvidedEnergyEffect.energyMap.reduce((left, p) => left + p.provides.length, 0);
      effect.damage += energyCount * 20;
    }

    // Iron Breaker
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.addMarker(this.METAL_LINKS_MAREKER, this);
    }

    if (effect instanceof UseAttackEffect && effect.player.active.marker.hasMarker(this.METAL_LINKS_MAREKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.METAL_LINKS_MAREKER, this);
    }

    return state;
  }

}
