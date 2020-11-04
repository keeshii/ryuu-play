import { Effect } from "../../game/store/effects/effect";
import { GameError } from "../../game/game-error";
import { GameMessage } from "../../game/game-message";
import { State } from "../../game/store/state/state";
import { StoreLike } from "../../game/store/store-like";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType, CardType, SuperType } from "../../game/store/card/card-types";
import { StateUtils } from "../../game/store/state-utils";
import { UseStadiumEffect } from "../../game/store/effects/game-effects";
import { ChooseCardsPrompt } from "../../game/store/prompts/choose-cards-prompt";
import { EnergyCard } from "../../game/store/card/energy-card";

export class ScorchedEarth extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'BW2';

  public name: string = 'Scorched Earth';

  public fullName: string = 'Scorched Earth PCL';

  public text: string =
    'Once during each player\'s turn, that player may discard ' +
    'a R or F Energy card from his or her hand. If that player does so, ' +
    'he or she draws 2 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;
      const stadiumUsedTurn = player.stadiumUsedTurn;

      let hasCardsInHand = false;
      const blocked: number[] = [];
      player.hand.cards.forEach((c, index) => {
        if (c instanceof EnergyCard) {
          if (c.provides.includes(CardType.FIRE) || c.provides.includes(CardType.FIGHTING)) {
            hasCardsInHand = true;
          } else {
            blocked.push(index);
          }
        }
      });

      if (hasCardsInHand === false) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.ENERGY },
        { allowCancel: true, min: 1, max: 1, blocked }
      ), selected => {
        selected = selected || [];
        if (selected.length === 0) {
          player.stadiumUsedTurn = stadiumUsedTurn;
          return;
        }
        player.hand.moveCardsTo(selected, player.discard);
        player.deck.moveTo(player.hand, 2);
      });
    }

    return state;
  }

}
