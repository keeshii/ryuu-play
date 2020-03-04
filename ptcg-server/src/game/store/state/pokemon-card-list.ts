import { CardList } from "./card-list";
import { SpecialCondition } from "../card/card-types";

export class PokemonCardList extends CardList {

  public damage: number = 0;

  public specialConditions: SpecialCondition[] = [];

}
