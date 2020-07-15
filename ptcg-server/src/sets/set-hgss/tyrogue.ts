import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { PowerType } from "../../game";

export class Tyrogue extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 30;

  public retreat = [ ];

  public powers = [{
    name: 'Sweet Sleeping Face',
    powerType: PowerType.POKEBODY,
    text: 'As long as Tyrogue is Asleep, prevent all damage done to Tyrogue ' +
      'by attacks.'
  }];

  public attacks = [
    {
      name: 'Mischievous Punch',
      cost: [ ],
      damage: 30,
      text: 'This attack\'s damage isn\'t affected by Weakness or Resistance. ' +
        'Tyrogue is now Asleep.'
    }
  ];

  public set: string = 'HGSS';

  public name: string = 'Tyrogue';

  public fullName: string = 'Tyrogue HGSS';

}
