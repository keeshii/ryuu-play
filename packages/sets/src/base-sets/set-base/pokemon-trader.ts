import {
  Card,
  ChooseCardsPrompt,
  Effect,
  GameError,
  GameMessage,
  ShowCardsPrompt,
  ShuffleDeckPrompt,
  State,
  StateUtils,
  StoreLike,
  SuperType,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const hasPokemon = player.hand.cards.some(c => c.superType === SuperType.POKEMON);

  if (!hasPokemon || player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Do not discard the card yet
  effect.preventDefault = true;

  let cardsFromHand: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_DECK,
      player.hand,
      { superType: SuperType.POKEMON },
      { min: 1, max: 1, allowCancel: true }
    ),
    selected => {
      cardsFromHand = selected || [];
      next();
    }
  );

  if (cardsFromHand.length === 0) {
    return state;
  }

  // Discard trainer only when user selected a Pokemon
  player.hand.moveCardTo(effect.trainerCard, player.discard);

  let cardsFromDeck: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.deck,
      { superType: SuperType.POKEMON },
      { min: 1, max: 1, allowCancel: true }
    ),
    selected => {
      cardsFromDeck = selected || [];
      next();
    }
  );

  if (cardsFromDeck.length > 0) {
    player.hand.moveCardsTo(cardsFromHand, player.deck);
    player.deck.moveCardsTo(cardsFromDeck, player.hand);
  }

  yield store.prompt(state, new ShowCardsPrompt(
    opponent.id,
    GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
    [...cardsFromHand, ...cardsFromDeck]),
  () => next()
  );

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class PokemonTrader extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS';

  public name: string = 'Pokémon Trader';

  public fullName: string = 'Pokémon Trader BS';

  public text: string =
    'Trade 1 of the Basic Pokémon or Evolution cards in your hand for 1 of the Basic Pokémon or Evolution cards ' +
    'from your deck. Show both cards to your opponent. Shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
