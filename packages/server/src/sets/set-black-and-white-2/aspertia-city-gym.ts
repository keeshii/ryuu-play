import { Effect } from '@ptcg/common';
import { GameError } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { State } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { TrainerCard } from '@ptcg/common';
import { TrainerType, CardType } from '@ptcg/common';
import { CheckHpEffect, CheckPokemonTypeEffect } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';
import { UseStadiumEffect } from '@ptcg/common';

export class AspertiaCityGym extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'BW2';

  public name: string = 'Aspertia City Gym';

  public fullName: string = 'Aspertia City Gym BC';

  public text: string =
    'Each C Pokemon in play (both yours and your opponent\'s) gets +20 HP.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckHpEffect && StateUtils.getStadiumCard(state) === this) {
      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkPokemonTypeEffect);

      if (checkPokemonTypeEffect.cardTypes.includes(CardType.COLORLESS)) {
        effect.hp += 20;
      }
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }

}
