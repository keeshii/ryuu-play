import { Effect } from '@ptcg/common';
import { GameError } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { State } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { TrainerCard } from '@ptcg/common';
import { TrainerType, CardType } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';
import { UseStadiumEffect } from '@ptcg/common';
import { CheckPokemonTypeEffect, CheckTableStateEffect } from '@ptcg/common';

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
