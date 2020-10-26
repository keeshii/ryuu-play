import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State, GamePhase } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { AfterDamageEffect } from "../../game/store/effects/attack-effects";
import { StateUtils } from "../../game/store/state-utils";

export class RockyHelmet extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'BW2';

  public name: string = 'Rocky Helmet';

  public fullName: string = 'Rocky Helmet BC';

  public text: string =
    'If the Pokemon this card is attached to is your Active Pokemon and is ' +
    'damaged by an opponent\'s attack (even if that Pokemon is Knocked Out), ' +
    'put 2 damage counters on the Attacking Pokemon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterDamageEffect && effect.target.tool === this) {
      const player = effect.player;
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
        return state;
      }

      if (state.phase === GamePhase.ATTACK) {
        effect.source.damage += 20;
      }
    }

    return state;
  }

}
