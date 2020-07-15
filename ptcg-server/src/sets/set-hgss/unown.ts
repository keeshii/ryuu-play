import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { PowerType } from "../../game";

export class Unown extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 50;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Return',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you put Unown from your hand onto ' +
      'your Bench, you may return all Energy attached to 1 of your Pokemon ' +
      'to your hand.'
  }];

  public attacks = [
    {
      name: 'Hidden Power',
      cost: [ CardType.PSYCHIC ],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'HGSS';

  public name: string = 'Unown';

  public fullName: string = 'Unown HGSS';

}
