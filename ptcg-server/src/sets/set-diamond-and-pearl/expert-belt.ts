import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";

export class ExpertBelt extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'DP';

  public name: string = 'Expert Belt';

  public fullName: string = 'Expert Belt A';

  public text: string =
    'Attach Expert Belt to 1 of your Pokemon that doesn\'t already have ' +
    'a Pokemon Tool attached to it. If that Pokemon is Knocked Out, ' +
    'discard this card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }

}
