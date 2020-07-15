import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { PowerType } from "../../game";

export class UnownQ extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 30;

  public weakness = [{ type: CardType.PSYCHIC, value: 10 }];

  public retreat = [ ];

  public powers = [{
    name: 'Quick',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), if Unown Q is on your ' +
      'Bench, you may discard all cards attached to Unown Q and attach Unown Q' +
      'to 1 of your Pokemon as Pokemon Tool card. As lon as Unown Q ' +
      'is attached to a Pokemon, you pay C less to retreat that Pokemon.'
  }];

  public attacks = [
    {
      name: 'Hidden Power',
      cost: [ CardType.COLORLESS ],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'DP';

  public name: string = 'Unown Q';

  public fullName: string = 'Unown Q MD';

}
