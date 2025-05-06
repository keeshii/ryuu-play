import { CardType } from '@ptcg/common';
import { EnergyCard } from '@ptcg/common';

export class FightingEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.FIGHTING ];

  public set: string = 'DP';

  public name = 'Fighting Energy';

  public fullName = 'Fighting Energy EVO';

}
