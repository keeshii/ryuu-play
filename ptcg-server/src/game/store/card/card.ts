import { SuperType } from "./card-types";


export abstract class Card {

  public abstract superType: SuperType;

  public abstract fullName: string;

  public abstract name: string;

}
