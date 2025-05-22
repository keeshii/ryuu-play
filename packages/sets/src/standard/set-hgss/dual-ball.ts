import {
  Card,
  ChooseCardsPrompt,
  CoinFlipPrompt,
  Effect,
  GameError,
  GameMessage,
  ShowCardsPrompt,
  ShuffleDeckPrompt,
  Stage,
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

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  let heads: number = 0;
  yield store.prompt(
    state,
    [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)],
    results => {
      results.forEach(r => {
        heads += r ? 1 : 0;
      });
      next();
    }
  );

  if (heads === 0) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.deck,
      { superType: SuperType.POKEMON, stage: Stage.BASIC },
      { allowCancel: true, min: 0, max: heads }
    ),
    results => {
      cards = results || [];
      next();
    }
  );

  player.deck.moveCardsTo(cards, player.hand);

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () =>
      next()
    );
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class DualBall extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'HGSS';

  public name: string = 'Dual Ball';

  public fullName: string = 'Dual Ball UNL';

  public text: string =
    'Flip 2 coins. For each heads, search your deck for a Basic Pokémon ' +
    'card, show it to your opponent, and put it into your hand. Shuffle your ' +
    'deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }
}
