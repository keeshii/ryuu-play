import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Leon extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'SSH';

  public name: string = 'Leon';

  public fullName: string = 'Leon VIV';

  public text: string =
    'During this turn, your Pokemon\'s attacks do 30 more damage to your ' +
    'opponent\'s Active Pokemon (before applying Weakness and Resistance).';

  private readonly LEON_MARKER = 'LEON_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      player.marker.addMarker(this.LEON_MARKER, this);
      return state;
    }

    if (effect instanceof DealDamageEffect) {
      const marker = effect.player.marker;
      if (marker.hasMarker(this.LEON_MARKER, this) && effect.damage > 0) {
        effect.damage += 30;
      }
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.LEON_MARKER, this);
      return state;
    }

    return state;
  }

}
