import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";

export class DualBall extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'HGSS';

  public name: string = 'Dual Ball';

  public fullName: string = 'Dual Ball UNL';

  public text: string =
    'Flip 2 coins. For each heads, search your deck for a Basic Pokemon ' +
    'card, show it to your opponent, and put it into your hand. Shuffle your ' +
    'deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }

}
