import { Effect } from "../../game/store/effects/effect";
import { GameError, GameMessage } from "../../game/game-error";
import { State } from "../../game/store/state/state";
import { StoreLike } from "../../game/store/store-like";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StateUtils } from "../../game/store/state-utils";
import { UseStadiumEffect } from "../../game/store/effects/game-effects";
import { BetweenTurnsEffect } from "../../game/store/effects/game-phase-effects";

export class VirbankCityGym extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'BW2';

  public name: string = 'Virbank City Gym';

  public fullName: string = 'Virbank City Gym PLS';

  public text: string =
    'Put 2 more damage counters on Poisoned Pokemon (both yours and your ' +
    'opponent\'s) between turns.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof BetweenTurnsEffect && StateUtils.getStadiumCard(state) === this) {
      effect.poisonDamage += 20;
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }

}
