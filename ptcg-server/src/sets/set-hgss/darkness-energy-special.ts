import { CardType, EnergyType } from "../../game/store/card/card-types";
import { EnergyCard } from "../../game/store/card/energy-card";

export class DarknessEnergySpecial extends EnergyCard {

  public provides: CardType[] = [ CardType.DARK ];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'HGSS';

  public name = 'Darkness Energy (Special)';

  public fullName = 'Darkness Energy (Special) HGSS';

}
