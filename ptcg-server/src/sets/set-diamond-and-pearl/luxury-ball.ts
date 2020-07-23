import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType, SuperType, CardTag } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { TrainerEffect } from "../../game/store/effects/play-card-effects";
import { ChooseCardsPrompt, Card, StateUtils, ShowCardsPrompt, ShuffleDeckPrompt,
  PokemonCard, GameError, GameMessage } from "../../game";
import { CardMessage } from "../card-message";

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] | null = [];

  const blocked = player.deck.cards
    .filter(c => c instanceof PokemonCard && c.tags.includes(CardTag.POKEMON_LV_X))
    .map(c => player.deck.cards.indexOf(c));

  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    CardMessage.CHOOSE_ONE_POKEMON,
    player.deck,
    { superType: SuperType.POKEMON },
    { min: 1, max: 1, allowCancel: true, blocked }
  ), selected => {
    cards = selected;
    next();
  });

  if (cards === null) {
    return state;
  }

  player.deck.moveCardsTo(cards, player.hand);

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(
      opponent.id,
      CardMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards
    ), () => next());
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
    next()
  });
}

export class LuxuryBall extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'DP';

  public name: string = 'Luxury Ball';

  public fullName: string = 'Luxury Ball SF';

  public text: string =
    'Search your deck for a Pokemon (excluding Pokemon LV.X), show it to ' +
    'your opponent, and put it into your hand. Shuffle your deck afterward. ' +
    'If any Luxury Ball is in your discard pile, you can\'t play this card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      if (player.discard.cards.some(c => c.name === this.name)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      let generator: IterableIterator<State>;
      generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
