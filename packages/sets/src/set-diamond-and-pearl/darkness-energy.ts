import { CardType, EnergyCard } from '@ptcg/common';

export class DarknessEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.DARK];

  public set: string = 'DP';

  public name = 'Darkness Energy';

  public fullName = 'Darkness Energy EVO';
}
