import { TrainerCard } from '@ptcg/common';
import { TrainerType } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';
import { DealDamageEffect } from '@ptcg/common';

export class MuscleBand extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'BW2';

  public name: string = 'Muscle Band';

  public fullName: string = 'Muscle Band XY';

  public text: string =
    'The attacks of the Pokemon this card is attached to do 20 more ' +
    'damage to our opponent\'s Active Pokemon (before aplying Weakness ' +
    'and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect && effect.source.cards.includes(this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (effect.damage > 0 && effect.target === opponent.active) {
        effect.damage += 20;
      }
    }

    return state;
  }

}
