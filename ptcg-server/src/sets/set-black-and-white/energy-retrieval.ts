import { CardMessage } from "../card-message";
import { GameError, GameMessage } from "../../game/game-error";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType, SuperType, EnergyType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { TrainerEffect } from "../../game/store/effects/play-card-effects";
import { ChooseCardsPrompt } from "../../game/store/prompts/choose-cards-prompt";
import {EnergyCard} from "../../game/store/card/energy-card";

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  // Player has no Basic Energy in the discard pile
  let basicEnergyCards = 0;
  player.discard.cards.forEach(c => {
    if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC) {
      basicEnergyCards++;
    }
  });
  if (basicEnergyCards === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  const min = Math.min(basicEnergyCards, 2);
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    CardMessage.CHOOSE_ENERGY_CARD,
    player.discard,
    { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
    { min, max: min, allowCancel: true }
  ), cards => {
    cards = cards || [];
    if (cards.length > 0) {
      // Discard trainer only when user selected a Pokemon
      player.hand.moveCardTo(effect.trainerCard, player.discard);
      // Recover discarded Pokemon
      player.discard.moveCardsTo(cards, player.hand);
    }
    next();
  });

  return state;
}

export class EnergyRetrieval extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW';

  public name: string = 'Energy Retrieval';

  public fullName: string = 'Energy Retrieval SUM';

  public text: string =
    'Put 2 basic Energy cards from your discard pile into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      let generator: IterableIterator<State>;
      generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
