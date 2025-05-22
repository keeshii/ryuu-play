import { CardType, EnergyCard } from '@ptcg/common';

export class GrassEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.GRASS];

  public set: string = 'DP';

  public name = 'Grass Energy';

  public fullName = 'Grass Energy EVO';
}
