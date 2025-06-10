import { CardType, CheckProvidedEnergyEffect, Effect, EnergyCard, EnergyType, State, StoreLike } from '@ptcg/common';

export class PrismEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'BW';

  public name = 'Prism Energy';

  public fullName = 'Prism Energy NXD';

  public text =
    'This card provides C Energy. If the Pokémon this card is attached to is ' +
    'a Basic Pokémon, this card provides every type of Energy but provides ' +
    'only 1 Energy at a time.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.energies.cards.includes(this) && effect.source.isBasic()) {
      effect.energyMap.push({ card: this, provides: [CardType.ANY] });
    }
    return state;
  }
}
