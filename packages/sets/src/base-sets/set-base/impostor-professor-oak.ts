import {
  Effect,
  ShuffleDeckPrompt,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType
} from '@ptcg/common';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: ImpostorProfessorOak,
  effect: TrainerEffect
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (opponent.hand.cards.length > 0) {
    opponent.hand.moveTo(opponent.deck);

    yield store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
      opponent.deck.applyOrder(order);
      next();
    });
  }

  opponent.deck.moveTo(opponent.hand, 7);
  return state;
}

export class ImpostorProfessorOak extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS';

  public name: string = 'Impostor Professor Oak';

  public fullName: string = 'Impostor Professor Oak BS';

  public text: string = 'Your opponent shuffles his or her hand into his or her deck, then draws 7 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
