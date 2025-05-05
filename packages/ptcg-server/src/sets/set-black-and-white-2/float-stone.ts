import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';

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
