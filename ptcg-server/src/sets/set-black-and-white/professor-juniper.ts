import { Effect } from "../../game/store/effects/effect";
import { GameError, GameMessage } from "../../game/game-error";
import { TrainerEffect } from "../../game/store/effects/play-card-effects";
import { State } from "../../game/store/state/state";
import { StoreLike } from "../../game/store/store-like";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";

export class ProfessorJuniper extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BW';

  public name: string = 'Professor Juniper';

  public fullName: string = 'Professor Juniper BW';

  public text: string =
    'Discard your hand and draw 7 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveTo(player.discard);
      player.deck.moveTo(player.hand, 7);
    }

    return state;
  }

}
