import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";

export class Eviolite extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'DP';

  public name: string = 'Eviolite';

  public fullName: string = 'Eviolite NV';

  public text: string =
    'If the Pokemon this card is attached to is a Basic Pokemon, ' +
    'any damage done to this Pokemon by attacks is reduced by 20 ' +
    '(after applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }

}
