import {
  Card,
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

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.deck,
      {},
      { min: 0, max: 2, allowCancel: true }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  // Get selected cards
  player.deck.moveCardsTo(cards, player.hand);

  // Shuffle the deck
  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Twins extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'HGSS';

  public name: string = 'Twins';

  public fullName: string = 'Twins TRM';

  public text: string =
    'You may use this card only if you have more Prize cards left than your ' +
    'opponent. Search your deck for any 2 cards and put them into your hand. ' +
    'Shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
