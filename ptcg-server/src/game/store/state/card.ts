export enum SuperType {
  NONE,
  POKEMON,
  TRAINER,
  ENERGY
}

export enum Stage {
  NONE,
  BASIC,
  STAGE_1,
  STAGE_2
}

export class Card {

  public superType: SuperType = SuperType.NONE;
  
  public stage: Stage = Stage.NONE;

  public name: string;

  constructor(name: string) {
    this.name = name;
  }

}
