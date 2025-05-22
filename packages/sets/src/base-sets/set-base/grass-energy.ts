import {
  CardType,
  EnergyCard,
} from '@ptcg/common';

export class GrassEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.GRASS];

  public set: string = 'BS';

  public name: string = 'Grass Energy';

  public fullName: string = 'Grass Energy BS';

}
