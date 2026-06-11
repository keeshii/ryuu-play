import {
  CardType,
  CheckProvidedEnergyEffect,
  Effect,
  EnergyCard,
  EnergyType,
  State,
  StoreLike,
} from '@ptcg/common';

export class BlendEnergyWLFM extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'BW4';

  public name = 'Blend Energy W L F M';

  public fullName = 'Blend Energy WLFM DGE';

  public text =
    'This card provides C Energy. When this card is attached to a Pokémon, ' +
    'this card provides W, L, F, or M Energy, but provides only 1 Energy at ' +
    'a time.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.energies.cards.includes(this)) {
      effect.energyMap.forEach(item => {
        if (item.card === this) {
          item.provides = [
            CardType.WATER,
            CardType.LIGHTNING,
            CardType.FIGHTING,
            CardType.METAL
          ];
        }
      });
    }
    return state;
  }
}
