import {
  Card,
  CardList,
  ChooseCardsPrompt,
  Effect,
  EnergyCard,
  GameError,
  GameMessage,
  OrderCardsPrompt,
  PokemonCard,
  ShowCardsPrompt,
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

  const deckTop = new CardList();
  player.deck.moveTo(deckTop, 3);

  const blocked: number[] = [];
  player.deck.cards.forEach((card, index) => {
    if (!(card instanceof PokemonCard) && !(card instanceof EnergyCard)) {
      blocked.push(index);
    }
  });

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      deckTop,
      {},
      { min: 0, max: 1, allowCancel: false, blocked }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () =>
      next()
    );
    deckTop.moveCardsTo(cards, player.hand);
  }

  return store.prompt(
    state,
    new OrderCardsPrompt(player.id, GameMessage.CHOOSE_CARDS_ORDER, deckTop, {
      allowCancel: true,
    }),
    order => {
      if (order !== null) {
        deckTop.applyOrder(order);
      }
      player.deck.cards.unshift(...deckTop.cards);
    }
  );
}

export class Pokenav extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'RS';

  public name: string = 'PokéNav';

  public fullName: string = 'PokéNav RS';

  public text: string =
    'Look at the top 3 cards of your deck, and choose a Basic Pokémon, Evolution card, or Energy card. Show it to ' +
    'your opponent and put it into your hand. Put the 2 other cards back on top of your deck in any order.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
