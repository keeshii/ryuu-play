import { Effect } from "../../game/store/effects/effect";
import { GameError, GameMessage } from "../../game/game-error";
import { State } from "../../game/store/state/state";
import { StoreLike } from "../../game/store/store-like";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType, SuperType, EnergyType } from "../../game/store/card/card-types";
import { StateUtils } from "../../game/store/state-utils";
import { UseStadiumEffect } from "../../game/store/effects/game-effects";
import { CardMessage } from "../card-message";
import {ChooseCardsPrompt} from "../../game/store/prompts/choose-cards-prompt";
import {Card} from "../../game/store/card/card";
import {ShowCardsPrompt} from "../../game/store/prompts/show-cards-prompt";
import {ShuffleDeckPrompt} from "../../game/store/prompts/shuffle-prompt";

function* useStadium(next: Function, store: StoreLike, state: State, effect: UseStadiumEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const stadiumUsedTurn = player.stadiumUsedTurn;
  let cards: Card[] = [];

  if (player.deck.cards.length === 0 || player.hand.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_USE_STADIUM);
  }

  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    CardMessage.CHOOSE_CARD_TO_DISCARD,
    player.hand,
    { },
    { min: 1, max: 1, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length === 0) {
    player.stadiumUsedTurn = stadiumUsedTurn;
    return state;
  }

  player.hand.moveCardsTo(cards, player.discard);

  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    CardMessage.CHOOSE_ENERGY_CARD,
    player.deck,
    { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
    { min: 1, max: 1, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

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
    next();
  });
}

export class ViridianForest extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'BW2';

  public name: string = 'Viridian Forest';

  public fullName: string = 'Viridian Forest TEU';

  public text: string =
    'Once during each player\'s turn, that player may discard a card from ' +
    'their hand. If they do, that player searches their deck for a basic ' +
    'Energy card, reveals it, and puts it into their hand. Then, that ' +
    'player shuffles their deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      let generator: IterableIterator<State>;
      generator = useStadium(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
