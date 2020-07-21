import { CardMessage } from "../card-message";
import { Effect } from "../../game/store/effects/effect";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { PlayTrainerEffect } from "../../game/store/effects/play-card-effects";
import { ChoosePokemonPrompt } from "../../game/store/prompts/choose-pokemon-prompt";
import { PlayerType, SlotType } from "../../game/store/actions/play-card-action";
import { GameError, GameMessage } from "../../game/game-error";
import { Player } from "../../game/store/state/player";

export class Seeker extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'HGSS';

  public name: string = 'Seeker';

  public fullName: string = 'Seeker TRM';

  public text: string =
    'Each player returns 1 of his or her Benched Pokemon and all cards ' +
    'attached to it to his or her hand. (You return your Pokemon first.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayTrainerEffect && effect.trainerCard === this) {

      const players: Player[] = [];
      state.players.forEach(player => {
        if (player.bench.some(b => b.cards.length > 0)) {
          players.push(player);
        }
      });

      if (players.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      players.forEach(player => {
        state = store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          CardMessage.CHOOSE_ONE_POKEMON,
          PlayerType.BOTTOM_PLAYER,
          [ SlotType.BENCH ],
          { allowCancel: false, count: 1 }
        ), selection => {
          const cardList = selection[0];
          cardList.moveTo(player.hand);
          cardList.clearEffects();
        });
      });

      return state;
    }
    return state;
  }

}
