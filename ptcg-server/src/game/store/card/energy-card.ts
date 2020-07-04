import { Card } from "./card";
import { SuperType, CardType, EnergyType } from "./card-types";


export abstract class EnergyCard extends Card {

  public superType: SuperType = SuperType.ENERGY;
  
  public energyType: EnergyType = EnergyType.BASIC;

  public provides: CardType[] = [];

  public text: string = '';
}
