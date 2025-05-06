import { Effect } from '@ptcg/common';
import { GameError } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { State } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { TrainerCard } from '@ptcg/common';
import { TrainerType, CardType, SuperType } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';
import { UseStadiumEffect } from '@ptcg/common';
import { ChooseCardsPrompt } from '@ptcg/common';
import { EnergyCard } from '@ptcg/common';

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
