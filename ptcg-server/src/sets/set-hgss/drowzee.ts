import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";

export class Drowzee extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 60;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Sleep Inducer',
      cost: [ CardType.PSYCHIC ],
      damage: 0,
      text: 'Switch the Defending Pokemon with 1 of your opponent\'s ' +
        'Benched Pokemon. The new Defending Pokemon is now Asleep.'
    },
    {
      name: 'Gentle Slap',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 20,
      text: ''
    },
  ];

  public set: string = 'HGSS';

  public name: string = 'Drowzee';

  public fullName: string = 'Drowzee HGSS';

}
