import { TrainerCard } from '@ptcg/common';
import { TrainerType } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { PutDamageEffect } from '@ptcg/common';

export class Eviolite extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'DP';

  public name: string = 'Eviolite';

  public fullName: string = 'Eviolite NV';

  public text: string =
    'If the Pokemon this card is attached to is a Basic Pokemon, ' +
    'any damage done to this Pokemon by attacks is reduced by 20 ' +
    '(after applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PutDamageEffect) {
      if (effect.target.tool === this && effect.target.isBasic()) {
        effect.damage -= 20;
      }
    }

    return state;
  }

}
