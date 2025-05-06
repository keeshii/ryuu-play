import { TrainerCard } from '@ptcg/common';
import { TrainerType, CardType } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { DealDamageEffect } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';
import { CheckPokemonTypeEffect } from '@ptcg/common';

export class DarkClaw extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'BW2';

  public name: string = 'Dark Claw';

  public fullName: string = 'Dark Claw DEX';

  public text: string =
    'If this card is attached to a D Pokemon, each of the attacks ' +
    'of that Pokemon does 20 more damage to the Active Pokemon ' +
    '(before applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect && effect.source.tool === this) {
      const opponent = StateUtils.findOwner(state, effect.target);

      // Not active Pokemon
      if (opponent.active !== effect.target) {
        return state;
      }

      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(effect.source);
      store.reduceEffect(state, checkPokemonTypeEffect);

      if (checkPokemonTypeEffect.cardTypes.includes(CardType.DARK)) {
        effect.damage += 20;
      }
    }

    return state;
  }

}
