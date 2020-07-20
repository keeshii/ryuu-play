import { Card } from "../../game/store/card/card";
import { CardMessage } from "../card-message";
import { ChooseCardsPrompt } from "../../game/store/prompts/choose-cards-prompt";
import { CoinFlipPrompt } from "../../game/store/prompts/coin-flip-prompt";
import { GameError, GameMessage } from "../../game/game-error";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { PlayTrainerEffect } from "../../game/store/effects/play-card-effects";
import { ShuffleDeckPrompt } from "../../game/store/prompts/shuffle-prompt";

function* playCard(next: Function, store: StoreLike, state: State, effect: PlayTrainerEffect): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  let coinResults: boolean[] = [];
  yield store.prompt(state, [
    new CoinFlipPrompt(player.id, CardMessage.COIN_FLIP),
    new CoinFlipPrompt(player.id, CardMessage.COIN_FLIP)
  ], results => {
    coinResults = results;
    next();
  });

  if (coinResults.every(r => r === true)) {
    let cards: Card[] = [];
    yield store.prompt(state, new ChooseCardsPrompt(
      player.id,
      CardMessage.CHOOSE_ANY_CARD,
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
    if (effect instanceof PlayTrainerEffect && effect.trainerCard === this) {
      let generator: IterableIterator<State>;
      generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
