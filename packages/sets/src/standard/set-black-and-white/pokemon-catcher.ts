import {
  Effect,
  State,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';
import { commonTrainers } from '../../common';

export class PokemonCatcher extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW';

  public name: string = 'Pokemon Catcher';

  public fullName: string = 'Pokemon Catcher SSH';

  public text: string =
    'Flip a coin. If heads, switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const pokemonCatcher = commonTrainers.pokemonCatcher(this, store, state, effect);

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      return pokemonCatcher.playCard(effect);
    }

    return state;
  }
}
