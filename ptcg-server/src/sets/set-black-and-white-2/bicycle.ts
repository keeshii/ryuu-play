import { Effect } from "../../game/store/effects/effect";
import { GameError } from "../../game/game-error";
import { GameMessage } from "../../game/game-message";
import { TrainerEffect } from "../../game/store/effects/play-card-effects";
import { State } from "../../game/store/state/state";
import { StoreLike } from "../../game/store/store-like";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";

export class Bicycle extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW2';

  public name: string = 'Bicycle';

  public fullName: string = 'Bicycle PLS';

  public text: string =
    'Draw cards until you have 4 cards in your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const cards = player.hand.cards.filter(c => c !== this);
      const cardsToDraw = Math.max(0, 4 - cards.length);

      if (cardsToDraw === 0 || player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.deck.moveTo(player.hand, cardsToDraw);
    }

    return state;
  }

}
