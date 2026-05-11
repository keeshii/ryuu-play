import {
  Effect,
  State,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';
import { commonTrainers } from '../../common';


export class Switch extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'RG';

  public name: string = 'Switch';

  public fullName: string = 'Switch RG';

  public text: string = 'Switch 1 of your Active Pokémon with 1 of your Benched Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const switchItem = commonTrainers.switchItem(this, store, state, effect);
    
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      switchItem.playCard(effect);
    }

    return state;
  }
}
