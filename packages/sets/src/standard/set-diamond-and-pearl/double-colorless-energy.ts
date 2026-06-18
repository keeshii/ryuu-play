import { CardType, EnergyCard, EnergyType } from '@ptcg/common';

export class DoubleColorlessEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];

  public provideAmount = 2;

  public energyType = EnergyType.SPECIAL;

  public set: string = 'DP';

  public name = 'Double Colorless Energy';

  public fullName = 'Double Colorless Energy EVO';

  public text: string = 'Double Colorless Energy provides C C Energy.';

}
