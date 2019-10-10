import { Card, SuperType, Stage } from "../../game/store/state/card";

export class BasicEnergy extends Card {

  public superType: SuperType = SuperType.ENERGY;
  
  public stage: Stage = Stage.BASIC;

  constructor(name: string) {
    super(name);
  }

}
