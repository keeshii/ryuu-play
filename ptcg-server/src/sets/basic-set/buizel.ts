import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";

export class Buizel extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 60;

  public weakness = [{
    type: CardType.LIGHTNING,
    value: 10
  }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    { name: 'Headbutt', cost: [], damage: 10, text: '' },
    { name: 'Surf', cost: [CardType.WATER, CardType.WATER], damage: 30, text: '' }
  ];

  public name: string = 'Buizel';

  public fullName: string = 'Buizel GE';

}
