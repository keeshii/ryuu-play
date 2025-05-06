import { TrainerCard } from '@ptcg/common';
import { TrainerType } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State, GamePhase } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { AfterDamageEffect } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';

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
