import {
  Effect,
  State,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';
import { commonTrainers } from '../../common';


export class EnergySwitch extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'RG';

  public name: string = 'Energy Switch';

  public fullName: string = 'Energy Switch RG';

  public text: string = 'Move a basic Energy card attached to 1 of your Pokémon to another of your Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const energySwitch = commonTrainers.energySwitch(this, store, state, effect);

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      return energySwitch.playCard(effect);
    }

    return state;
  }
}
