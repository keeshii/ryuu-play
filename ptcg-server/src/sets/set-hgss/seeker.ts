import { Effect } from "../../game/store/effects/effect";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";

export class Seeker extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'HGSS';

  public name: string = 'Seeker';

  public fullName: string = 'Seeker TRM';

  public text: string =
    'Each player returns 1 of his or her Benched Pokemon and all cards ' +
    'attached to it to his or her hand. (You return your Pokemon first.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }

}
