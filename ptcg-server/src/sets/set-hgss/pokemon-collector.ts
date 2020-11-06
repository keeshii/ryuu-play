import { Card } from "../../game/store/card/card";
import { GameMessage } from "../../game/game-message";
import { Effect } from "../../game/store/effects/effect";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType, SuperType, Stage } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { StateUtils } from "../../game/store/state-utils";
import { TrainerEffect } from "../../game/store/effects/play-card-effects";
import { ChooseCardsPrompt } from "../../game/store/prompts/choose-cards-prompt";
import { ShowCardsPrompt } from "../../game/store/prompts/show-cards-prompt";
import { ShuffleDeckPrompt } from "../../game/store/prompts/shuffle-prompt";

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.POKEMON, stage: Stage.BASIC } as any,
    { min: 0, max: 3, allowCancel: true }
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
    next()
  });
}

export class PokemonCollector extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'HGSS';

  public name: string = 'Pokemon Collector';

  public fullName: string = 'Pokemon Collector HGSS';

  public text: string =
    'Search your deck for up to 3 Basic Pokemon, show them to your opponent, ' +
    'and put them into your hand. Shuffle your deck afterward.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      let generator: IterableIterator<State>;
      generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
