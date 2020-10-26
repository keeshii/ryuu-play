import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, SpecialCondition } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect } from "../../game/store/effects/game-effects";
import {AddSpecialConditionsEffect} from "../../game/store/effects/attack-effects";


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
