import { Effect } from "../../game/store/effects/effect";
import { GameError } from "../../game/game-error";
import { GameMessage } from "../../game/game-message";
import { State } from "../../game/store/state/state";
import { StoreLike } from "../../game/store/store-like";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType, CardType } from "../../game/store/card/card-types";
import { StateUtils } from "../../game/store/state-utils";
import { UseStadiumEffect } from "../../game/store/effects/game-effects";
import { CheckPokemonTypeEffect, CheckTableStateEffect } from "../../game/store/effects/check-effects";

export class SteelShelter extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'BW3';

  public name: string = 'Steel Shelter';

  public fullName: string = 'Steel Shelter PFO';

  public text: string =
    'Each M Pokemon (both yours and your opponent\'s) can\'t be affected ' +
    'by any Special Conditions. (Remove any Special Conditions affecting ' +
    'those Pokemon.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckTableStateEffect && StateUtils.getStadiumCard(state) === this) {
      state.players.forEach(player => {
        if (player.active.specialConditions.length === 0) {
          return;
        }

        const checkPokemonTypeEffect = new CheckPokemonTypeEffect(player.active);
        store.reduceEffect(state, checkPokemonTypeEffect);

        if (checkPokemonTypeEffect.cardTypes.includes(CardType.METAL)) {
          const conditions = player.active.specialConditions.slice();
          conditions.forEach(condition => {
            player.active.removeSpecialCondition(condition);
          });
        }
      });
      return state;
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }

}
