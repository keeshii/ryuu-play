import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, SpecialCondition } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { StateUtils } from "../../game/store/state-utils";


export class Trubbish extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 70;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [{
    name: 'Pound',
    cost: [ CardType.COLORLESS, CardType.COLORLESS ],
    damage: 20,
    text: ''
  }, {
    name: 'Poison Gas',
    cost: [ CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 30,
    text: 'The Defending Pokemon is now Poisoned.'
  }];

  public set: string = 'BW2';

  public name: string = 'Trubbish';

  public fullName: string = 'Trubbish LT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.addSpecialCondition(SpecialCondition.POISONED);
    }
    return state;
  }

}
