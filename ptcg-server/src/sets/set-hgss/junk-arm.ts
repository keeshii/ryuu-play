import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";

export class JunkArm extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'HGSS';

  public name: string = 'Junk Arm';

  public fullName: string = 'Junk Arm TRM';

  public text: string =
    'Discard 2 cards from your hand. Search your discard pile for a Trainer ' +
    'card, show it to your opponent, and put it into your hand. You can\'t ' +
    'choose Junk Arm with the effect of this card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }

}
