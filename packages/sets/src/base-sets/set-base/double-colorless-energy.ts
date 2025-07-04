import { CardType, EnergyCard, EnergyType } from '@ptcg/common';

export class DoubleColorlessEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS, CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'BS';

  public name: string = 'Double Colorless Energy';

  public fullName: string = 'Double Colorless Energy BS';

  public text: string = 'Provides C C energy. Doesn\'t count as a basic Energy card.';

}
