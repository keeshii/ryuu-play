import {
  CardType,
  EnergyCard,
} from '@ptcg/common';

export class FightingEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.FIGHTING];

  public set: string = 'RS';

  public name: string = 'Fighting Energy';

  public fullName: string = 'Fighting Energy RS';

}
