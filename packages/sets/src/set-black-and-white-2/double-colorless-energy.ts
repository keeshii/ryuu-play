import { CardType, EnergyType } from '@ptcg/common';
import { EnergyCard } from '@ptcg/common';

export class DoubleColorlessEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.COLORLESS, CardType.COLORLESS ];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'BW2';

  public name = 'Double Colorless Energy';

  public fullName = 'Double Colorless Energy XY';

}
