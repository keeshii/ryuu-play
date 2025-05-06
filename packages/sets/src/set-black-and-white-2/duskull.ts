import { PokemonCard } from '@ptcg/common';
import { Stage, CardType, SpecialCondition } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { AttackEffect } from '@ptcg/common';
import {AddSpecialConditionsEffect } from '@ptcg/common';


export class Duskull extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 50;

  public weakness = [{ type: CardType.DARK }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Confuse Ray',
    cost: [ CardType.PSYCHIC ],
    damage: 0,
    text: 'The Defending Pokemon is now Confused.'
  }];

  public set: string = 'BW2';

  public name: string = 'Duskull';

  public fullName: string = 'Duskull BC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, specialConditionEffect);
    }
    return state;
  }

}
