import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";

export class PokemonRescue extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'DP';

  public name: string = 'Pokemon Rescue';

  public fullName: string = 'Pokemon Rescue PL';

  public text: string =
    'Search your discard pile for a Pokemon, show it to your opponent, ' +
    'and put it into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }

}
