import { Card } from "../../game/store/card/card";
import { GameMessage } from "../../game/game-message";
import { Effect } from "../../game/store/effects/effect";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType, SuperType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { StateUtils } from "../../game/store/state-utils";
import { TrainerEffect } from "../../game/store/effects/play-card-effects";
import { ChooseCardsPrompt } from "../../game/store/prompts/choose-cards-prompt";
import { ShowCardsPrompt } from "../../game/store/prompts/show-cards-prompt";
import { ShuffleDeckPrompt } from "../../game/store/prompts/shuffle-prompt";
import { PokemonCard } from "../../game/store/card/pokemon-card";

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  const blocked: number[] = [];
  player.deck.cards.forEach((card, index) => {
    if (card instanceof PokemonCard && card.hp > 90) {
      blocked.push(index);
    }
  });

  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.POKEMON },
    { min: 1, max: 1, allowCancel: true, blocked }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.deck.moveCardsTo(cards, player.hand);

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(
      opponent.id,
      GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards
    ), () => next());
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class LevelBall extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW';

  public name: string = 'Level Ball';

  public fullName: string = 'Level Ball NXD';

  public text: string =
    'Search your deck for a Pokemon with 90 HP or less, reveal it, ' +
    'and put it into your hand. Shuffle your deck afterward.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      let generator: IterableIterator<State>;
      generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
