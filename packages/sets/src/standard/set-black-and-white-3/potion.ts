import {
  Effect,
  State,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';
import { commonTrainers } from '../../common';

export class Potion extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW3';

  public name: string = 'Potion';

  public fullName: string = 'Potion BC';

  public text: string = 'Heal 30 damage from 1 of your Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const potion = commonTrainers.potion(this, store, state, effect);

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      return potion.playCard(effect, 30);
    }

    return state;
  }
}
