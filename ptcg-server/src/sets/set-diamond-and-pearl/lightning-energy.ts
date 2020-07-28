import { CardType } from "../../game/store/card/card-types";
import { EnergyCard } from "../../game/store/card/energy-card";

export class LightningEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.LIGHTNING ];

  public set: string = 'DP';

  public name = 'Lightning Energy';

  public fullName = 'Lightning Energy EVO';

}
