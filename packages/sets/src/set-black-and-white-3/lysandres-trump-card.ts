import {
  Effect,
  ShuffleDeckPrompt,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: LysandresTrumpCard,
  effect: TrainerEffect
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  let cards = player.discard.cards.filter(c => c.name !== self.name);
  player.discard.moveCardsTo(cards, player.deck);

  yield store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
    next();
  });

  cards = opponent.discard.cards.filter(c => c.name !== self.name);
  opponent.discard.moveCardsTo(cards, opponent.deck);

  return store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
    opponent.deck.applyOrder(order);
  });
}

export class LysandresTrumpCard extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BW3';

  public name: string = 'Lysandre\'s Trump Card';

  public fullName: string = 'Lysandres Trump Card PFO';

  public text: string =
    'Each player shuffles all cards in his or her discard pile into his or ' +
    'her deck (except for Lysandre\'s Trump Card).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
