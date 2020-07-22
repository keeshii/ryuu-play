import { Card } from "../../game/store/card/card";
import { CardMessage } from "../card-message";
import { ChooseCardsPrompt } from "../../game/store/prompts/choose-cards-prompt";
import { Effect } from "../../game/store/effects/effect";
import { GameError, GameMessage } from "../../game/game-error";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { PlayTrainerEffect } from "../../game/store/effects/play-card-effects";
import { ShuffleDeckPrompt } from "../../game/store/prompts/shuffle-prompt";
import { StateUtils } from "../../game/store/state-utils";

function* playCard(next: Function, store: StoreLike, state: State, effect: PlayTrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    CardMessage.CHOOSE_ANY_TWO_CARDS,
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
  yield store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
    next();
  });

  return state;
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
    if (effect instanceof PlayTrainerEffect && effect.trainerCard === this) {
      let generator: IterableIterator<State>;
      generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
