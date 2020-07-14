import { Effect } from "../../game/store/effects/effect";
import { PlayTrainerEffect } from "../../game/store/effects/play-card-effects";
import { ShuffleDeckPrompt } from "../../game/store/prompts/shuffle-prompt";
import { State } from "../../game/store/state/state";
import { StateUtils } from "../../game/store/state-utils";
import { StoreLike } from "../../game/store/store-like";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";

export class N extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'DP';

  public name: string = 'N';

  public fullName: string = 'N NV';

  public text: string =
    'Each player shuffles his or her hand into his or her deck. ' +
    'Then, each player draws a card for each of his or her remaining Prize cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayTrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.hand.moveTo(player.deck);
      opponent.hand.moveTo(opponent.deck);

      store.prompt(state, [
        new ShuffleDeckPrompt(player.id),
        new ShuffleDeckPrompt(opponent.id)
      ], deckOrder => {
        player.deck.applyOrder(deckOrder[0]);
        opponent.deck.applyOrder(deckOrder[1]);

        player.deck.moveTo(player.hand, player.getPrizeLeft());
        opponent.deck.moveTo(opponent.hand, opponent.getPrizeLeft());
      });
    }

    return state;
  }

}
