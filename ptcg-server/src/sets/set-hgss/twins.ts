import { Effect } from "../../game/store/effects/effect";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";

export class Twins extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'HGSS';

  public name: string = 'Twins';

  public fullName: string = 'Twins TRM';

  public text: string =
    'You may use this card only if you have more Prize cards left than your ' +
    'opponent. Search your deck for any 2 cards and put them into your hand. ' +
    'Shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }

}
