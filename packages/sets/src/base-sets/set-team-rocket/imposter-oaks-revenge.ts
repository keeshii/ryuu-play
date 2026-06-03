import {
  Card,
  CardList,
  ChooseCardsPrompt,
  Effect,
  GameError,
  GameMessage,
  ShuffleDeckPrompt,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect, self: ImposterOaksRevenge): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const handWithoutOak = new CardList();
  handWithoutOak.cards = player.hand.cards.filter(c => c !== self);

  // We don't have a card to shuffle into deck
  if (handWithoutOak.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_DECK,
      handWithoutOak,
      {},
      { min: 1, max: 1, allowCancel: true }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  // Operation canceled by the user
  if (cards.length === 0) {
    return state;
  }

  player.hand.moveCardTo(self, player.discard);
  player.hand.moveCardsTo(cards, player.discard);
  opponent.hand.moveTo(opponent.deck);

  return store.prompt(state, [new ShuffleDeckPrompt(opponent.id)], deckOrder => {
    opponent.deck.applyOrder(deckOrder);
    opponent.deck.moveTo(opponent.hand, 4);
  });
}

export class ImposterOaksRevenge extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'TR';

  public name: string = 'Imposter Oak\'s Revenge';

  public fullName: string = 'Imposter Oak\'s Revenge TR';

  public text: string =
    'Discard a card from your hand in order to play this card. Your opponent shuffles his or her hand into his or ' +
    'her deck, then draws 4 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect, this);
      return generator.next().value;
    }

    return state;
  }
}
