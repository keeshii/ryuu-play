import { Effect, State, StoreLike, TrainerCard, TrainerEffect, TrainerType } from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  // const player = effect.player;
  // const opponent = StateUtils.getOpponent(state, player);
  return state;
}

export class LadyOuting extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'RS';

  public name: string = 'Lady Outing';

  public fullName: string = 'Lady Outing RS';

  public text: string =
    'Search your deck for up to 3 different types of basic Energy cards, show them to your opponent, and put them ' +
    'into your hand. Shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
