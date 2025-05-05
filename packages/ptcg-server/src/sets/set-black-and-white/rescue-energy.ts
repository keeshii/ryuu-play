import { Card } from '../../game/store/card/card';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State, GamePhase } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';

export class RescueEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.COLORLESS ];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'BW';

  public name = 'Rescue Energy';

  public fullName = 'Rescue Energy TRM';

  public readonly RESCUE_ENERGY_MAREKER = 'RESCUE_ENERGY_MAREKER';

  public text =
    'Rescue Energy provides C Energy. If the Pokemon this card is attached ' +
    'to is Knocked Out by damage from an attack, put that Pokemon back into ' +
    'your hand. (Discard all cards attached to that Pokemon.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {
      const player = effect.player;

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      const target = effect.target;
      const cards = target.getPokemons();
      cards.forEach(card => {
        player.marker.addMarker(this.RESCUE_ENERGY_MAREKER, card);
      });
    }

    if (effect instanceof BetweenTurnsEffect) {
      state.players.forEach(player => {

        if (!player.marker.hasMarker(this.RESCUE_ENERGY_MAREKER)) {
          return;
        }

        const rescued: Card[] = player.marker.markers
          .filter(m => m.name === this.RESCUE_ENERGY_MAREKER)
          .map(m => m.source);

        player.discard.moveCardsTo(rescued, player.hand);
        player.marker.removeMarker(this.RESCUE_ENERGY_MAREKER);
      });
    }

    return state;
  }

}
