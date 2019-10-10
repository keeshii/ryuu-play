import { Card, SuperType, Stage } from "../../game/store/state/card";

export class Buizel extends Card {

  public superType: SuperType = SuperType.POKEMON;
  
  public stage: Stage = Stage.BASIC;

  constructor(name: string) {
    super(name);
  }

}
