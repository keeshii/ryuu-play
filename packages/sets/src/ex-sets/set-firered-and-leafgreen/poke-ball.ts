import {
  Effect,
  State,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';
import { commonTrainers } from '../../common';

export class PokeBall extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'RG';

  public name: string = 'Poké Ball';

  public fullName: string = 'Poke Ball RG';

  public text: string =
    'Flip a coin. If heads, search your deck for a Basic Pokémon or Evolution card, show it to your opponent and ' +
    'put it into your hand. Shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const pokeBall = commonTrainers.pokeBall(this, store, state, effect);

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      return pokeBall.playCard(effect);
    }

    return state;
  }
}
