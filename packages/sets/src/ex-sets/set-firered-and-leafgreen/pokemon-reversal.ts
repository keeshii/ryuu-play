import {
  Effect,
  State,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';
import { commonTrainers } from '../../common';

export class PokemonReversal extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'RG';

  public name: string = 'Pokémon Reversal';

  public fullName: string = 'Pokemon Reversal RG';

  public text: string =
    'Flip a coin. If heads, choose 1 of your opponent\'s Benched Pokémon and switch it with 1 of the Defending ' +
    'Pokémon. Your opponent chooses the Defending Pokémon to switch.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const pokemonCatcher = commonTrainers.pokemonCatcher(this, store, state, effect);

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      return pokemonCatcher.playCard(effect);
    }

    return state;
  }
}
