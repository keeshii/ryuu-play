import { CardType, EnergyCard } from '@ptcg/common';

export class PsychicEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.PSYCHIC];

  public set: string = 'RS';

  public name: string = 'Psychic Energy';

  public fullName: string = 'Psychic Energy RS';
}
