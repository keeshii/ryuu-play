import { Effect } from '@ptcg/common';
import { GameError } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { State } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { TrainerCard } from '@ptcg/common';
import { TrainerType, Stage } from '@ptcg/common';
import { CheckHpEffect } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';
import { UseStadiumEffect } from '@ptcg/common';

export class TrainingCenter extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'BW2';

  public name: string = 'Training Center';

  public fullName: string = 'Training Center FFI';

  public text: string =
    'Each Stage 1 and Stage 2 Pokemon in play (both yours and your ' +
    'opponent\'s) gets +30 HP.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckHpEffect && StateUtils.getStadiumCard(state) === this) {
      const card = effect.target.getPokemonCard();

      if (card === undefined) {
        return state;
      }

      if (card.stage === Stage.STAGE_1 || card.stage === Stage.STAGE_2) {
        effect.hp += 30;
      }
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }

}
