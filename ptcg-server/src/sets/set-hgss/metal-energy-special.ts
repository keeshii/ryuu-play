import { CardType, EnergyType } from "../../game/store/card/card-types";
import { EnergyCard } from "../../game/store/card/energy-card";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { DealDamageAfterWeaknessEffect } from "../../game/store/effects/attack-effects";
import { CheckPokemonTypeEffect } from "../../game/store/effects/check-effects";

export class MetalEnergySpecial extends EnergyCard {

  public provides: CardType[] = [ CardType.METAL ];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'HGSS';

  public name = 'Metal Energy (Special)';

  public fullName = 'Metal Energy (Special) HGSS';

  public text = 'Damage done by attacks to the Pokemon that Metal Energy is ' +
    'attached to is reduced by 10 (after applying Weakness and Resistance). ' +
    'Ignore this effect if the Pokemon that Metal Energy is attached to ' +
    'isn\'t M. Metal Energy provides M Energy. (Doesn\'t count as a basic ' +
    'Energy card.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageAfterWeaknessEffect) {
      if (effect.target.cards.includes(this)) {
        const checkPokemonType = new CheckPokemonTypeEffect(effect.target);
        store.reduceEffect(state, checkPokemonType);
        if (checkPokemonType.cardTypes.includes(CardType.METAL)) {
          effect.damage -= 10;
        }
      }
    }

    return state;
  }

}
