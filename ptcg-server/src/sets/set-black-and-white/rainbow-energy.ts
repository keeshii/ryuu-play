import { CardType, EnergyType } from "../../game/store/card/card-types";
import { EnergyCard } from "../../game/store/card/energy-card";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { CheckProvidedEnergyEffect } from "../../game/store/effects/check-effects";
import { AttachEnergyEffect } from "../../game/store/effects/play-card-effects";

export class RainbowEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.COLORLESS ];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'BW';

  public name = 'Rainbow Energy';

  public fullName = 'Rainbow Energy SUM';

  public text =
    'This card provides C Energy. While in play, this card provides every ' +
    'type of Energy but provides only 1 Energy at a time. When you attach ' +
    'this card from your hand to 1 of your Pokemon, put 1 damage counter ' +
    'on that Pokemon.'

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      effect.energyMap.push({ card: this, provides: [ CardType.ANY ] });
    }
    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      effect.target.damage += 10;
    }
    return state;
  }

}
