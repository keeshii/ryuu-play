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

export class Recycle extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'FO';

  public name: string = 'Recycle';

  public fullName: string = 'Recycle FO';

  public text: string = 'Flip a coin. If heads, put a card in your discard pile on top of your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
