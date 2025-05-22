import {
  CardType,
  EnergyCard,
} from '@ptcg/common';

export class PsychicEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.PSYCHIC];

  public set: string = 'BS';

  public name: string = 'Psychic Energy';

  public fullName: string = 'Psychic Energy BS';

}
