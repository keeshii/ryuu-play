import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { PowerType } from "../../game";

export class Cleffa extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 30;

  public retreat = [ ];

  public powers = [{
    name: 'Sweet Sleeping Face',
    powerType: PowerType.POKEBODY,
    text: 'As long as Cleffa is Asleep, prevent all damage done to Cleffa ' +
      'by attacks.'
  }];

  public attacks = [
    {
      name: 'Eeeeeeek',
      cost: [ ],
      damage: 0,
      text: 'Shuffle your hand into your deck, then draw 6 cards. Cleffa is ' +
        'now Asleep.'
    }
  ];

  public set: string = 'HGSS';

  public name: string = 'Cleffa';

  public fullName: string = 'Cleffa HGSS';

}
