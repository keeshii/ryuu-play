import { Effect } from "../../game/store/effects/effect";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { TrainerEffect } from "../../game/store/effects/play-card-effects";
import { DealDamageEffect } from "../../game/store/effects/attack-effects";
import { EndTurnEffect } from "../../game/store/effects/game-phase-effects";

export class PlusPower extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW';

  public name: string = 'PlusPower';

  public fullName: string = 'PlusPower BW';

  public text: string =
    'During this turn, your Pokemon\'s attacks do 10 more damage to the ' +
    'Active Pokemon (before applying Weakness and Resistance).';

  private readonly PLUS_POWER_MARKER = 'PLUS_POWER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      player.marker.addMarker(this.PLUS_POWER_MARKER, this);
    }

    if (effect instanceof DealDamageEffect) {
      const marker = effect.player.marker;
      if (marker.hasMarker(this.PLUS_POWER_MARKER, this) && effect.damage > 0) {
        effect.damage += 10;
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.PLUS_POWER_MARKER, this);
    }

    return state;
  }

}
