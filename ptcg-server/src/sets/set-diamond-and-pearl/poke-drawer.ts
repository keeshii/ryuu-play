import { Card } from '../../game/store/card/card';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const name = effect.trainerCard.name;

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const count = player.hand.cards.reduce((sum, c) => {
    return sum + (c.name === name ? 1 : 0);
  }, 0);
  let playTwoCards = false;

  if (count >= 2) {
    yield store.prompt(state, new ConfirmPrompt(
      player.id,
      GameMessage.WANT_TO_PLAY_BOTH_CARDS_AT_ONCE
    ), result => {
      playTwoCards = result;
      next();
    });
  }

  if (playTwoCards === false) {
    player.deck.moveTo(player.hand, 1);
    return state;
  }

  // Discard second Poke-Drawer +
  const second = player.hand.cards.find(c => {
    return c.name === name && c !== effect.trainerCard;
  });
  if (second !== undefined) {
    player.hand.moveCardTo(second, player.discard);
  }

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { },
    { min: 0, max: 2, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  // Get selected cards
  player.deck.moveCardsTo(cards, player.hand);

  // Shuffle the deck
  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class PokeDrawer extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'DP';

  public name: string = 'Poke Drawer +';

  public fullName: string = 'Poke Drawer SF';

  public text: string =
    'You may play 2 Poke Drawer + at the same time. If you play 1 ' +
    'Poke Drawer +, draw a card. If you play 2 Poke Drawer +, search your ' +
    'deck for up to 2 cards, and put them into your hand. Shuffle your deck ' +
    'afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
