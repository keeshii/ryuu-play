import { CardType, EnergyType } from "../../game/store/card/card-types";
import { EnergyCard } from "../../game/store/card/energy-card";

export class MetalEnergySpecial extends EnergyCard {

  public provides: CardType[] = [ CardType.METAL ];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'HGSS';

  public name = 'Metal Energy (Special)';

  public fullName = 'Metal Energy (Special) HGSS';

}
