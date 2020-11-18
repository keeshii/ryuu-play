import { Card } from "../../game/store/card/card";
import { GameError } from "../../game/game-error";
import { GameMessage } from "../../game/game-message";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType, SuperType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { PokemonCard } from "../../game/store/card/pokemon-card";
import { TrainerEffect } from "../../game/store/effects/play-card-effects";
import { ChooseCardsPrompt } from "../../game/store/prompts/choose-cards-prompt";
import { ShuffleDeckPrompt } from "../../game/store/prompts/shuffle-prompt";

function* playCard(next: Function, store: StoreLike, state: State,
  self: SacredAsh, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  let pokemonsInDiscard: number = 0;
  const blocked: number[] = [];
  player.discard.cards.forEach(c => {
    if (c instanceof PokemonCard) {
      pokemonsInDiscard += 1;
    }
  });

  // Player does not have correct cards in discard
  if (pokemonsInDiscard === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  const max = Math.min(5, pokemonsInDiscard);
  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_DECK,
    player.discard,
    { superType: SuperType.POKEMON },
    { min: max, max, allowCancel: true, blocked }
  ), selected => {
    cards = selected || [];
    next();
  });

  // Operation canceled by the user
  if (cards.length === 0) {
    return state;
  }

  player.hand.moveCardTo(self, player.discard);
  player.discard.moveCardsTo(cards, player.deck);

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class SacredAsh extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW3';

  public name: string = 'Sacred Ash';

  public fullName: string = 'Sacred Ash FLF';

  public text: string =
    'Shuffle 5 Pokemon from your discard pile into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      let generator: IterableIterator<State>;
      generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }

}
