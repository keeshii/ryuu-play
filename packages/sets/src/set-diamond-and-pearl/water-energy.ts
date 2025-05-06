import { CardType } from '@ptcg/common';
import { EnergyCard } from '@ptcg/common';

export class WaterEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.WATER ];

  public set: string = 'DP';

  public name = 'Water Energy';

  public fullName = 'Water Energy EVO';

}
