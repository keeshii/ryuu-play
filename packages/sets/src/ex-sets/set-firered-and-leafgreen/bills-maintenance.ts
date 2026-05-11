import {
  Card,
  ChooseCardsPrompt,
  Effect,
  GameError,
  GameMessage,
  ShuffleDeckPrompt,
  State,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType
} from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect, self: BillsMaintenance): IterableIterator<State> {
  const player = effect.player;

  // We don't have a card to shuffle into deck
  if (!player.hand.cards.some(c => c !== self)) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Don't allow to shufle the supporter card (not necessary when supporter effect is copied by ability)
  const blocked: number[] = [];
  const index = player.hand.cards.indexOf(self);
  if (index !== -1) {
    blocked.push(index);
  }

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_DECK,
      player.hand,
      {},
      { min: 1, max: 1, allowCancel: false, blocked }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  player.hand.moveCardsTo(cards, player.deck);

  return store.prompt(state, [new ShuffleDeckPrompt(player.id)], deckOrder => {
    player.deck.applyOrder(deckOrder);
    player.deck.moveTo(player.hand, 3);
  });
}

export class BillsMaintenance extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'RG';

  public name: string = 'Bill\'s Maintenance';

  public fullName: string = 'Bill\'s Maintenance RG';

  public text: string = 'If you have any cards in your hand, shuffle 1 of them into your deck, then draw 3 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect, this);
      return generator.next().value;
    }

    return state;
  }
}
