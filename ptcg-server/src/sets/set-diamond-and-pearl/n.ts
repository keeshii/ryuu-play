import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";

export class N extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'DP';

  public name: string = 'N';

  public fullName: string = 'N NV';

  public text: string =
    'Each player shuffles his or her hand into his or her deck. ' +
    'Then, each player draws a card for each of his or her remaining Prize cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }

}
