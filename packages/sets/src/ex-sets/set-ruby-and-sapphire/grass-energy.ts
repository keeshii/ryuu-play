import {
  CardType,
  EnergyCard,
} from '@ptcg/common';

export class GrassEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.GRASS];

  public set: string = 'RS';

  public name: string = 'Grass Energy';

  public fullName: string = 'Grass Energy RS';

}
