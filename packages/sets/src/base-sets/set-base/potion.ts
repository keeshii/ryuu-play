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

  public set: string = 'BS';

  public name: string = 'Potion';

  public fullName: string = 'Potion BS';

  public text: string = 'Remove up to 2 damage counters from 1 of your Pokémon.';

  public potion(store: StoreLike, state: State, effect: Effect): State {
    const potion = commonTrainers.potion(this, store, state, effect);

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      return potion.playCard(effect, 20);
    }

    return state;
  }
}
