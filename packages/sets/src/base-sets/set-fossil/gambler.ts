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

export class Gambler extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'FO';

  public name: string = 'Gambler';

  public fullName: string = 'Gambler FO';

  public text: string =
    'Shuffle your hand into your deck. Flip a coin. If heads, draw 8 cards. If tails, draw 1 card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
