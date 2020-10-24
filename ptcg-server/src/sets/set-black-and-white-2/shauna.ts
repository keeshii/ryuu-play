import { Effect } from "../../game/store/effects/effect";
import { TrainerEffect } from "../../game/store/effects/play-card-effects";
import { State } from "../../game/store/state/state";
import { StoreLike } from "../../game/store/store-like";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { ShuffleDeckPrompt } from "../../game/store/prompts/shuffle-prompt";

function* playCard(next: Function, store: StoreLike, state: State,
    self: Shauna, effect: TrainerEffect): IterableIterator<State> {

  const player = effect.player;
  const cards = player.hand.cards.filter(c => c !== self);

  if (cards.length > 0) {
    player.hand.moveCardsTo(cards, player.deck);

    yield store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
      player.deck.applyOrder(order);
      next();
    });
  }

  player.deck.moveTo(player.hand, 5);
  return state;
}

export class Shauna extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BW2';

  public name: string = 'Shauna';

  public fullName: string = 'Shauna XY';

  public text: string =
    'Shuffle your hand into your deck. Then, draw 5 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      let generator: IterableIterator<State>;
      generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }

}
