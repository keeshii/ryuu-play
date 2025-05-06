import { Card } from '@ptcg/common';
import { ChooseCardsPrompt } from '@ptcg/common';
import { CoinFlipPrompt } from '@ptcg/common';
import { GameError } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { TrainerCard } from '@ptcg/common';
import { TrainerType } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { TrainerEffect } from '@ptcg/common';
import { ShuffleDeckPrompt } from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  let coinResults: boolean[] = [];
  yield store.prompt(state, [
    new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
    new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
  ], results => {
    coinResults = results;
    next();
  });

  if (coinResults.every(r => r === true)) {
    let cards: Card[] = [];
    yield store.prompt(state, new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.deck,
      { },
      { min: 1, max: 1, allowCancel: false }
    ), selected => {
      cards = selected;
      next();
    });

    // Get selected cards
    player.deck.moveCardsTo(cards, player.hand);

    // Shuffle the deck
    yield store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
      player.deck.applyOrder(order);
      next();
    });

    return state;
  }

  if (coinResults.some(r => r === true)) {
    // Get selected cards
    player.deck.moveTo(player.hand, 1);
    return state;
  }

  return state;
}

export class VictoryMedal extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'DP';

  public name: string = 'Victory Medal';

  public fullName: string = 'Victory Medal PR';

  public text: string =
    'Flip 2 coins. If one of them is heads, draw a card. If both are heads, ' +
    'search your deck for any 1 card, put it into your hand, and shuffle ' +
    'your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
