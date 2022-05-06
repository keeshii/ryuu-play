import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class FairyEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.FAIRY ];

  public set: string = 'DP';

  public name = 'Fairy Energy';

  public fullName = 'Fairy Energy EVO';

}
