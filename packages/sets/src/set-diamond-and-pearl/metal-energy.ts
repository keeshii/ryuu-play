import { CardType } from '@ptcg/common';
import { EnergyCard } from '@ptcg/common';

export class MetalEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.METAL ];

  public set: string = 'DP';

  public name = 'Metal Energy';

  public fullName = 'Metal Energy EVO';

}
