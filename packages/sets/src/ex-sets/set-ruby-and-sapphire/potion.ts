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

  public set: string = 'RS';

  public name: string = 'Potion';

  public fullName: string = 'Potion RS';

  public text: string =
    'Remove 2 damage counters from 1 of your Pokémon (remove 1 damage counter if that Pokémon has only 1).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const potion = commonTrainers.potion(this, store, state, effect);

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      return potion.playCard(effect, 20);
    }

    return state;
  }
}
