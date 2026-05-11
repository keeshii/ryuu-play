import {
  Effect,
  State,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';
import { commonTrainers } from '../../common';

export class CrushingHammer extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW';

  public name: string = 'Crushing Hammer';

  public fullName: string = 'Crushing Hammer EPO';

  public text: string = 'Flip a coin. If heads, discard an Energy attached to 1 of your opponent\'s Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const crushingHammer = commonTrainers.crushingHammer(this, store, state, effect);

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      return crushingHammer.playCard(effect);
    }

    return state;
  }
}
