import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";

export class PokemonCollector extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'HGSS';

  public name: string = 'Pokemon Collector';

  public fullName: string = 'Pokemon Collector HGSS';

  public text: string =
    'Search your deck for up to 3 Basic Pokemon, show them to your opponent, ' +
    'and put them into your hand. Shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }

}
