import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";

export class PokedexHandy extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'DP';

  public name: string = 'Pokedex Handy910is';

  public fullName: string = 'Pokedex Handy PL';

  public text: string =
    'Look at the top 2 cards of your deck, choose 1 of them, and put it into ' +
    'your hand. Put the other card on the bottom of your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }

}
