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

  public set: string = 'BW3';

  public name: string = 'Energy Switch';

  public fullName: string = 'Energy Switch LT';

  public text: string = 'Move a basic Energy from 1 of your Pokémon to another of your Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const energySwitch = commonTrainers.energySwitch(this, store, state, effect);

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      return energySwitch.playCard(effect);
    }

    return state;
  }
}
