import { CardType } from "../../game/store/card/card-types";
import { EnergyCard } from "../../game/store/card/energy-card";

export class MetalEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.METAL ];

  public set: string = 'DP';

  public name = 'Metal Energy';

  public fullName = 'Metal Energy EVO';

}
