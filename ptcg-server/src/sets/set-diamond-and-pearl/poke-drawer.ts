import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";

export class PokeBlower extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'DP';

  public name: string = 'Poke Blower +';

  public fullName: string = 'Poke Blower SF';

  public text: string =
    'You may play 2 Poke Blower + at the same time. If you play 1 ' +
    'Poke Blower +, flip a coin. If heads, put 1 damage counter on 1 of your ' +
    'opponent\'s Pokemon. If you play 2 Poke Blower +, choose 1 of your ' +
    'opponent\'s Benched Pokemon and switch it with 1 of your opponent\'s ' +
    'Active Pokemon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }

}
