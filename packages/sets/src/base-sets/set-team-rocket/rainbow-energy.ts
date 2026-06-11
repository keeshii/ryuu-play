import {
  AttachEnergyEffect,
  CardType,
  CheckProvidedEnergyEffect,
  Effect,
  EnergyCard,
  EnergyType,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class RainbowEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'TR';

  public name: string = 'Rainbow Energy';

  public fullName: string = 'Rainbow Energy TR';

  public text: string =
    'Attach Rainbow Energy to 1 of your Pokémon. While in play, Rainbow Energy counts as every type of basic Energy ' +
    'but only provides 1 Energy at a time. (Doesn\'t count as a basic Energy card when not in play.) When you attach ' +
    'this card from your hand to 1 of your Pokémon, it does 10 damage to that Pokémon. (Don\'t apply Weakness and ' +
    'Resistance.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.energies.cards.includes(this)) {
      effect.energyMap.forEach(item => {
        if (item.card === this) {
          item.provides = StateUtils.rainbowEnergy();
        }
      });
    }
    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      effect.target.damage += 10;
    }
    return state;
  }
}
