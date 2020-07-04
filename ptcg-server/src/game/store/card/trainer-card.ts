import { Card } from "./card";
import { SuperType, TrainerType } from "./card-types";


export abstract class TrainerCard extends Card {

  public superType: SuperType = SuperType.TRAINER;

  public trainerType: TrainerType = TrainerType.ITEM;

  public text: string = '';
}
