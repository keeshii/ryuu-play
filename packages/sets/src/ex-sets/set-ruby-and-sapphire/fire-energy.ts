import {
  CardType,
  EnergyCard,
} from '@ptcg/common';

export class FireEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.FIRE];

  public set: string = 'RS';

  public name: string = 'Fire Energy';

  public fullName: string = 'Fire Energy RS';

}
