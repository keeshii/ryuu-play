import { Effect } from "../../game/store/effects/effect";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { TrainerEffect } from "../../game/store/effects/play-card-effects";
import { StateUtils } from "../../game/store/state-utils";
import { GameError } from "../../game/game-error";
import { GameMessage } from "../../game/game-message";
import { DealDamageEffect } from "../../game/store/effects/attack-effects";
import { EndTurnEffect } from "../../game/store/effects/game-phase-effects";

export class BlackBelt extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'HGSS';

  public name: string = 'Black Belt';

  public fullName: string = 'Black Belt TRM';

  public text: string =
    'You may use this card only if you have more Prize cards left than your ' +
    'opponent. During this turn, each of your Active Pokemon\'s attacks does ' +
    '40 more damage to your opponent\'s Active Pokemon (before applying ' +
    'Weakness and Resistance).';

  private readonly BLACK_BELT_MARKER = 'BLACK_BELT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.marker.addMarker(this.BLACK_BELT_MARKER, this);
    }

    if (effect instanceof DealDamageEffect) {
      const marker = effect.player.marker;
      if (marker.hasMarker(this.BLACK_BELT_MARKER, this) && effect.damage > 0) {
        effect.damage += 40;
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.BLACK_BELT_MARKER, this);
    }

    return state;
  }

}
