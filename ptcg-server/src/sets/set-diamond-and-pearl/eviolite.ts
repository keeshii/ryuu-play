import { TrainerCard } from "../../game/store/card/trainer-card";
import { TrainerType, Stage } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import {DealDamageAfterWeaknessEffect} from "../../game/store/effects/game-effects";

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
    if (effect instanceof DealDamageAfterWeaknessEffect) {
      if (effect.target.tool === this) {
        const pokemonCard = effect.target.getPokemonCard();
        if (pokemonCard && pokemonCard.stage === Stage.BASIC) {
          effect.damage -= 20;
        }
      }
    }

    return state;
  }

}
