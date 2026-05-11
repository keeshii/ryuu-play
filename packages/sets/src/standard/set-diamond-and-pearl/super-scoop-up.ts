import {
  Effect,
  State,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';
import { commonTrainers } from '../../common';


export class SuperScoopUp extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'DP';

  public name: string = 'Super Scoop Up';

  public fullName: string = 'Super Scoop Up CES';

  public text: string =
    'Flip a coin. If heads, put 1 of your Pokémon and all cards attached to it into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const superScoopUp = commonTrainers.superScoopUp(this, store, state, effect);

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      return superScoopUp.playCard(effect);
    }

    return state;
  }
}
