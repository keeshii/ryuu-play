import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class PsychicEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.PSYCHIC ];

  public set: string = 'DP';

  public name = 'Psychic Energy';

  public fullName = 'Psychic Energy EVO';

}
