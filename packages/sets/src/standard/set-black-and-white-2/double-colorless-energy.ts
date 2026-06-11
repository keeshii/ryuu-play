import { CardType, EnergyCard, EnergyType } from '@ptcg/common';

export class DoubleColorlessEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];

  public provideAmount = 2;

  public energyType = EnergyType.SPECIAL;

  public set: string = 'BW2';

  public name = 'Double Colorless Energy';

  public fullName = 'Double Colorless Energy XY';

  public text: string = 'Provides C C energy. Doesn\'t count as a basic Energy card.';

}
