import { Effect, ShuffleDeckPrompt, State, StoreLike, TrainerCard, TrainerEffect, TrainerType } from '@ptcg/common';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: ProfessorOaksNewTheory,
  effect: TrainerEffect
): IterableIterator<State> {
  const player = effect.player;
  const cards = player.hand.cards.filter(c => c !== self);

  if (cards.length > 0) {
    player.hand.moveCardsTo(cards, player.deck);

    yield store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
      player.deck.applyOrder(order);
      next();
    });
  }

  player.deck.moveTo(player.hand, 6);
  return state;
}

export class ProfessorOaksNewTheory extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BW';

  public name: string = 'Professor Oak\'s New Theory';

  public fullName: string = 'Professor Oaks New Theory HGSS';

  public text: string = 'Shuffle your hand into your deck. Then, draw 6 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
