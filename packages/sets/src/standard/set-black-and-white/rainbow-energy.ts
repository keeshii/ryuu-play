import {
  AttachEnergyEffect,
  CardType,
  CheckProvidedEnergyEffect,
  Effect,
  EnergyCard,
  EnergyType,
  State,
  StoreLike,
} from '@ptcg/common';

export class RainbowEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'BW';

  public name = 'Rainbow Energy';

  public fullName = 'Rainbow Energy SUM';

  public text =
    'This card provides C Energy. While in play, this card provides every ' +
    'type of Energy but provides only 1 Energy at a time. When you attach ' +
    'this card from your hand to 1 of your Pokémon, put 1 damage counter ' +
    'on that Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.energies.cards.includes(this)) {
      effect.energyMap.forEach(item => {
        if (item.card === this) {
          item.provides = [CardType.ANY];
        }
      });
    }
    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      effect.target.damage += 10;
    }
    return state;
  }
}
