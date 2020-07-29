import { Effect } from "../../game/store/effects/effect";
import { State } from "../../game/store/state/state";
import { StoreLike } from "../../game/store/store-like";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType, Stage, CardType } from "../../game/store/card/card-types";
import { CheckRetreatCostEffect } from "../../game/store/effects/check-effects";
import { StateUtils } from "../../game/store/state-utils";

export class SkyarrowBridge extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'BW';

  public name: string = 'Skyarrow Bridge';

  public fullName: string = 'Skyarrow Bridge NXD';

  public text: string =
    'The Retreat Cost of each Basic Pokemon in play is C less.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckRetreatCostEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard && pokemonCard.stage == Stage.BASIC) {
        const index = effect.cost.indexOf(CardType.COLORLESS);
        if (index !== -1) {
          effect.cost.splice(index, 1);
        }
      }
    }

    return state;
  }

}
