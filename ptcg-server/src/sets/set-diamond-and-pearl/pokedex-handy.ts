import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { TrainerEffect } from "../../game/store/effects/play-card-effects";
import { CardList } from "../../game/store/state/card-list";
import { ChooseCardsPrompt } from "../../game/store/prompts/choose-cards-prompt";
import { CardMessage } from "../card-message";

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  const deckTop = new CardList();
  player.deck.moveTo(deckTop, 2);

  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    CardMessage.CHOOSE_ANY_CARD,
    deckTop,
    { },
    { min: 1, max: 1, allowCancel: false }
  ), selected => {
    deckTop.moveCardsTo(selected, player.hand);
    deckTop.moveTo(player.deck);
    next();
  });

  return state;
}

export class PokedexHandy extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'DP';

  public name: string = 'Pokedex Handy910is';

  public fullName: string = 'Pokedex Handy PL';

  public text: string =
    'Look at the top 2 cards of your deck, choose 1 of them, and put it into ' +
    'your hand. Put the other card on the bottom of your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      let generator: IterableIterator<State>;
      generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
