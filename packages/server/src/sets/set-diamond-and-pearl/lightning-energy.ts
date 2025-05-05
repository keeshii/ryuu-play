import { CardType } from '@ptcg/common';
import { EnergyCard } from '@ptcg/common';

export class LightningEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.LIGHTNING ];

  public set: string = 'DP';

  public name = 'Lightning Energy';

  public fullName = 'Lightning Energy EVO';

}
