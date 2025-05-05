import { Effect } from '@ptcg/common';
import { GameError } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { State } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { TrainerCard } from '@ptcg/common';
import { TrainerType, CardType } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';
import { UseStadiumEffect } from '@ptcg/common';
import { CheckProvidedEnergyEffect, CheckPokemonStatsEffect } from '@ptcg/common';

export class ShadowCircle extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'BW3';

  public name: string = 'Shadow Circle';

  public fullName: string = 'Shadow Circle XY';

  public text: string =
    'Each Pokemon that has any D Energy attached to it (both yours ' +
    'and your opponent\'s) has no Weakness.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckPokemonStatsEffect && StateUtils.getStadiumCard(state) === this) {

      const target = effect.target;
      const player = StateUtils.findOwner(state, target);

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, target);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      const energyMap = checkProvidedEnergyEffect.energyMap;
      const hasDarknessEnergy = StateUtils.checkEnoughEnergy(energyMap, [ CardType.DARK ]);

      if (hasDarknessEnergy) {
        effect.weakness = [];
      }

      return state;
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }

}
