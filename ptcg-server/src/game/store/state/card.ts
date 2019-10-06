export enum SuperType {
  NONE,
  POKEMON,
  TRAINER,
  ENERGY
}

export class Card {

  public superType: SuperType = SuperType.NONE;

  public name: string;

  constructor(name: string) {
    this.name = name;
  }

}
