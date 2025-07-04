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

  public set: string = 'BW';

  public name: string = 'Rare Candy';

  public fullName: string = 'Rare Candy SUM';

  public text: string =
    'Choose 1 of your Basic Pokémon in play. If you have a Stage 2 card in ' +
    'your hand that evolves from that Pokémon, put that card onto the Basic ' +
    'Pokémon to evolve it. You can\'t use this card during your first turn ' +
    'or on a Basic Pokémon that was put into play this turn.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const rareCandy = commonTrainers.rareCandy(this, store, state, effect);

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      rareCandy.playCard(effect);
    }

    return state;
  }
}
