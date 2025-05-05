import { CardType } from '@ptcg/common';
import { EnergyCard } from '@ptcg/common';

export class PsychicEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.PSYCHIC ];

  public set: string = 'DP';

  public name = 'Psychic Energy';

  public fullName = 'Psychic Energy EVO';

}
