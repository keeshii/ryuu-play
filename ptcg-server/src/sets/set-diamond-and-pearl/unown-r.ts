import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { PowerType } from "../../game";

export class UnownR extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 60;

  public weakness = [{ type: CardType.PSYCHIC, value: 10 }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Retire',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, if Unown R is on your Bench, you may ' +
      'discard Unown R and all cards attached to it. (This doesn\'t count ' +
      'as a Knocked Out Pokémon.) Then, draw a card.'
  }];

  public attacks = [
    {
      name: 'Hidden Power',
      cost: [ ],
      damage: 0,
      text: 'Move any number of basic Energy cards attached to your Pokémon ' +
        'to your other Pokémon in any way you like.'
    }
  ];

  public set: string = 'DP';

  public name: string = 'Unown R';

  public fullName: string = 'Unown R PL';

}
