import { PokemonCard } from '@ptcg/common';
import { Stage, CardType } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State, GamePhase } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { AttackEffect } from '@ptcg/common';
import { PutDamageEffect, AddMarkerEffect } from '@ptcg/common';
import { EndTurnEffect } from '@ptcg/common';

export class Regigigas extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 130;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [{
    name: 'Daunt',
    cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 80,
    text: 'During your opponent\'s next turn, any damage done by attacks ' +
      'from the Defending Pokemon is reduced by 40 (before applying ' +
      'Weakness and Resistance).'
  }, {
    name: 'Heavy Impact',
    cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 100,
    text: ''
  }];

  public set: string = 'BW2';

  public name: string = 'Regigigas';

  public fullName: string = 'Regigigas PFO';

  public readonly DAUNT_MARKER = 'DAUNT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const addMarkerEffect = new AddMarkerEffect(effect, this.DAUNT_MARKER, this);
      return store.reduceEffect(state, addMarkerEffect);
    }

    // Reduce damage by 40
    if (effect instanceof PutDamageEffect
      && effect.source.marker.hasMarker(this.DAUNT_MARKER, this)) {

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      effect.damage -= 40;
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.DAUNT_MARKER, this);
    }

    return state;
  }

}
