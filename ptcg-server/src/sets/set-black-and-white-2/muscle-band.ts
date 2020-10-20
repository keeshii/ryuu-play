import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { StateUtils } from "../../game/store/state-utils";
import { DealDamageEffect } from "../../game/store/effects/attack-effects";

export class MuscleBand extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'BW2';

  public name: string = 'Muscle Band';

  public fullName: string = 'Muscle Band XY';

  public text: string =
    'The attacks of the Pokemon this card is attached to do 20 more ' +
    'damage to our opponent\'s Active Pokemon (before aplying Weakness ' +
    'and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect && effect.source.cards.includes(this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (effect.damage > 0 && effect.target === opponent.active) {
        effect.damage += 20;
      }
    }

    return state;
  }

}
