import { TrainerCard } from '@ptcg/common';
import { TrainerType } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { CheckHpEffect } from '@ptcg/common';
import { KnockOutEffect } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';
import { DealDamageEffect } from '@ptcg/common';

export class ExpertBelt extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'DP';

  public name: string = 'Expert Belt';

  public fullName: string = 'Expert Belt A';

  public text: string =
    'The Pokemon this card is attached to gets +20 HP and that Pokemon\'s ' +
    'attacks do 20 more damage to your opponent\'s Active Pokemon (before ' +
    'applying Weakness and Resistance). When the Pokemon this card is ' +
    'attached to is Knocked Out, your opponent takes 1 more Prize card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckHpEffect && effect.target.cards.includes(this)) {
      effect.hp += 20;
    }

    if (effect instanceof DealDamageEffect && effect.source.cards.includes(this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (effect.damage > 0 && effect.target === opponent.active) {
        effect.damage += 20;
      }
    }

    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {
      effect.prizeCount += 1;
    }

    return state;
  }

}
