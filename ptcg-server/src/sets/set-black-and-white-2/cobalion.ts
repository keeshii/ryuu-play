import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { DealDamageEffect } from "../../game/store/effects/attack-effects";
import { StateUtils } from "../../game/store/state-utils";
import { GameMessage, GameError } from "../../game/game-error";
import { CheckProvidedEnergyEffect } from "../../game/store/effects/check-effects";
import { EndTurnEffect } from "../../game/store/effects/game-phase-effects";

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
    if (effect instanceof DealDamageEffect && effect.attack === this.attacks[0]) {
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

    if (effect instanceof AttackEffect && effect.player.active.marker.hasMarker(this.METAL_LINKS_MAREKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.METAL_LINKS_MAREKER, this);
    }

    return state;
  }

}
