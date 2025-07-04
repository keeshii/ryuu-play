import {
  Effect,
  State,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

import { commonTrainers } from '../../common';

export class RareCandy extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'SS';

  public name: string = 'Rare Candy';

  public fullName: string = 'Rare Candy SS';

  public text: string =
    'Choose 1 of your Basic Pokémon in play. If you have a Stage 1 or Stage 2 card that evolves from that Pokémon ' +
    'in your hand, put that card on the Basic Pokémon. (This counts as evolving that Pokémon.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const rareCandy = commonTrainers.rareCandy(this, store, state, effect);

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      rareCandy.playCard(effect);
    }

    return state;
  }
}
