import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";

export class VictoryMedal extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'DP';

  public name: string = 'Victory Medal';

  public fullName: string = 'Victory Medal PR';

  public text: string =
    'Flip 2 coins. If one of them is heads, draw a card. If both are heads, ' +
    'search your deck for any 1 card, put it into your hand, and shuffle ' +
    'your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }

}
