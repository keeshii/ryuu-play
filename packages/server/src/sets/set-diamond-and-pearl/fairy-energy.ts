import { CardType } from '@ptcg/common';
import { EnergyCard } from '@ptcg/common';

export class FairyEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.FAIRY ];

  public set: string = 'DP';

  public name = 'Fairy Energy';

  public fullName = 'Fairy Energy EVO';

}
