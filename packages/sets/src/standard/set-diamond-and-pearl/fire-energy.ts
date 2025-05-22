import { CardType, EnergyCard } from '@ptcg/common';

export class FireEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.FIRE];

  public set: string = 'DP';

  public name = 'Fire Energy';

  public fullName = 'Fire Energy EVO';
}
