import {
  Effect,
  State,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  // const player = effect.player;
  // const opponent = StateUtils.getOpponent(state, player);
  return state;
}

export class PokeBall extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'JU';

  public name: string = 'Poké Ball';

  public fullName: string = 'Poke Ball JU';

  public text: string =
    'Flip a coin. If heads, you may search your deck for any Basic Pokémon or Evolution card. Show that card to ' +
    'your opponent, then put it into your hand. Shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
