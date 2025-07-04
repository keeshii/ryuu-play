import {
  Effect,
  State,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

import { commonTrainers } from '../../common';

export class PokemonBreeder extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS';

  public name: string = 'Pokémon Breeder';

  public fullName: string = 'Pokémon Breeder BS';

  public text: string =
    'Put a Stage 2 Evolution card from your hand on the matching Basic Pokémon. You can only play this card when ' +
    'you would be allowed to evolve that Pokémon anyway.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const rareCandy = commonTrainers.rareCandy(this, store, state, effect);

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      rareCandy.playCard(effect);
    }

    return state;
  }
}
