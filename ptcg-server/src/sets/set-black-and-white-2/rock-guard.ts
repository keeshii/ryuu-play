import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType, CardTag } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State, GamePhase } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { PutDamageEffect } from "../../game/store/effects/attack-effects";
import { StateUtils } from "../../game/store/state-utils";

export class RockGuard extends TrainerCard {

  public tags = [ CardTag.ACE_SPEC ];

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'BW2';

  public name: string = 'Rock Guard';

  public fullName: string = 'Rock Guard PLF';

  public text: string =
    'If the Pokemon this card is attached to is your Active Pokemon and is ' +
    'damaged by an opponent\'s attack (even if that Pokemon is Knocked Out), ' +
    'put 6 damage counters on the Attacking Pokemon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PutDamageEffect && effect.target.tool === this) {
      const player = effect.player;
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
        return state;
      }

      if (state.phase === GamePhase.ATTACK) {
        effect.source.damage += 60;
      }
    }

    return state;
  }

}
