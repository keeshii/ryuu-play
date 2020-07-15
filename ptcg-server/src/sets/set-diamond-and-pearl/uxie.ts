import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { PowerType } from "../../game";

export class Uxie extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 70;

  public weakness = [{ type: CardType.PSYCHIC, value: 20 }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Set Up',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you put Uxie from your hand onto ' +
      'your Bench, you may draw cards until you have 7 cards in your hand.'
  }];

  public attacks = [
    {
      name: 'Psychic Restore',
      cost: [ CardType.COLORLESS ],
      damage: 20,
      text: 'You may put Uxie and all cards attached to it on the bottom of ' +
        'your deck in any order.'
    }
  ];

  public set: string = 'DP';

  public name: string = 'Uxie LA';

  public fullName: string = 'Uxie LA';

}
