import { CardType, EnergyType, Stage } from "../../game/store/card/card-types";
import { EnergyCard } from "../../game/store/card/energy-card";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { CheckProvidedEnergyEffect } from "../../game/store/effects/check-effects";

export class PrismEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.COLORLESS ];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'BW';

  public name = 'Prism Energy';

  public fullName = 'Prism Energy NXD';

  public text =
    'This card provides C Energy. If the Pokemon this card is attached to is ' +
    'a Basic Pokemon, this card provides every type of Energy but provides ' +
    'only 1 Energy at a time.'

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const pokemonCard = effect.source.getPokemonCard();
      if (pokemonCard !== undefined && pokemonCard.stage === Stage.BASIC) {
        effect.energyMap.push({ card: this, provides: [ CardType.ANY ] });
      }
    }
    return state;
  }

}
