import { Effect } from "../../game/store/effects/effect";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";

export class BlackBelt extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'HGSS';

  public name: string = 'Black Belt';

  public fullName: string = 'Black Belt TRM';

  public text: string =
    'You may use this card only if you have more Prize cards left than your ' +
    'opponent. During this turn, each of your Active Pokemon\'s attacks does ' +
    '40 more damage to your opponent\'s Active Pokemon (before applying ' +
    'Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }

}
