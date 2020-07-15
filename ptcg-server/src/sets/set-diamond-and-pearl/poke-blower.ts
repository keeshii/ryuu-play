import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";

export class PokeDrawer extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'DP';

  public name: string = 'Poke Drawer +';

  public fullName: string = 'Poke Drawer SF';

  public text: string =
    'You may play 2 Poke Drawer + at the same time. If you play 1 ' +
    'Poke Drawer +, draw a card. If you play 2 Poke Drawer +, search your ' +
    'deck for up to 2 cards, and put them into your hand. Shuffle your deck ' +
    'afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }

}
