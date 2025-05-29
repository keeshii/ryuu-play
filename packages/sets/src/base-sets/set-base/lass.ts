import {
  Effect,
  GameError,
  GameMessage,
  ShowCardsPrompt,
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
  self: Lass,
  effect: TrainerEffect
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const itemTypes = [TrainerType.ITEM, TrainerType.TOOL];
  const playerHand = player.hand.cards.filter(c => c !== self);
  const opponentHand = opponent.hand.cards;

  if (playerHand.length + opponentHand.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  yield store.prompt(state, [
    ...(playerHand.length ? [
      new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, playerHand)
    ]: []),
    ...(opponentHand.length ? [
      new ShowCardsPrompt(player.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, opponentHand)
    ] : [])
  ], () => next());

  const playerTrainers = playerHand.filter(c => c instanceof TrainerCard && itemTypes.includes(c.trainerType));
  if (playerTrainers.length > 0) {
    player.hand.moveCardsTo(playerTrainers, player.deck);
    yield store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
      player.deck.applyOrder(order);
      next();
    });
  }

  const opponentTrainers = opponentHand.filter(c => c instanceof TrainerCard && itemTypes.includes(c.trainerType));
  if (opponentTrainers.length > 0) {
    opponent.hand.moveCardsTo(opponentTrainers, opponent.deck);
    yield store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
      opponent.deck.applyOrder(order);
      next();
    });
  }

  return state;
}

export class Lass extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS';

  public name: string = 'Lass';

  public fullName: string = 'Lass BS';

  public text: string =
    'You and your opponent show each other your hands, then shuffle all the Trainer cards from your hands into your ' +
    'decks.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
