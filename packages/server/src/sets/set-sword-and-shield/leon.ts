import { Effect } from '@ptcg/common';
import { TrainerCard } from '@ptcg/common';
import { TrainerType } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { TrainerEffect } from '@ptcg/common';
import { DealDamageEffect } from '@ptcg/common';
import { EndTurnEffect } from '@ptcg/common';

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
