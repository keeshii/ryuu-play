import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";

export class SuperScoopUp extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'DP';

  public name: string = 'Super Scoop Up';

  public fullName: string = 'Super Scoop Up CES';

  public text: string =
    'Flip a coin. If heads, put 1 of your Pokemon ' +
    'and all cards attached to it into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }

}
