import {
  CardType,
  EnergyCard,
} from '@ptcg/common';

export class WaterEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.WATER];

  public set: string = 'BS';

  public name: string = 'Water Energy';

  public fullName: string = 'Water Energy BS';

}
