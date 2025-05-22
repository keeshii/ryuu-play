import {
  CardType,
  EnergyCard,
} from '@ptcg/common';

export class LightningEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.LIGHTNING];

  public set: string = 'BS';

  public name: string = 'Lightning Energy';

  public fullName: string = 'Lightning Energy BS';

}
