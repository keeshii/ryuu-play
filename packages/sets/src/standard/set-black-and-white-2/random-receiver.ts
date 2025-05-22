import {
  Card,
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

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const cards: Card[] = [];
  let supporter: Card | undefined;
  for (let i = 0; i < player.deck.cards.length; i++) {
    const card = player.deck.cards[i];
    cards.push(card);

    if (card instanceof TrainerCard && card.trainerType === TrainerType.SUPPORTER) {
      supporter = card;
      break;
    }
  }

  yield store.prompt(
    state,
    [
      new ShowCardsPrompt(player.id, GameMessage.CARDS_SHOWED_BY_EFFECT, cards),
      new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards),
    ],
    () => next()
  );

  if (supporter !== undefined) {
    player.deck.moveCardTo(supporter, player.hand);
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class RandomReceiver extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW2';

  public name: string = 'Random Receiver';

  public fullName: string = 'Random Receiver DEX';

  public text: string =
    'Reveal cards from the top of your deck until you reveal a Supporter ' +
    'card. Put it into your hand. Shuffle the other cards back into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
