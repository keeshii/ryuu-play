import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";

export class LuxuryBall extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'DP';

  public name: string = 'Luxury Ball';

  public fullName: string = 'Luxury Ball SF';

  public text: string =
    'Search your deck for a Pokemon (excluding Pokemon LV.X), show it to ' +
    'your opponent, and put it into your hand. Shuffle your deck afterward. ' +
    'If any Luxury Ball is in your discard pile, you can\'t play this card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }

}
