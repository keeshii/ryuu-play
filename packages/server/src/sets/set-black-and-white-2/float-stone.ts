import { TrainerCard } from '@ptcg/common';
import { TrainerType } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { CheckRetreatCostEffect } from '@ptcg/common';

export class FloatStone extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'BW2';

  public name: string = 'Float Stone';

  public fullName: string = 'Float Stone PLF';

  public text: string =
    'The Pokemon this card is attached to has no Retreat Cost.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckRetreatCostEffect && effect.player.active.tool === this) {
      effect.cost = [];
    }

    return state;
  }

}
