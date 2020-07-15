import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { PowerType } from "../../game/store/card/pokemon-types";

export class Smeargle extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 70;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Portrait',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), if Smeargle is your ' +
      'Active Pokemon, you may look at your opponent\'s hand. If you do, ' +
      'choose a Support card you find there and use the effect of that card ' +
      'as the effect of this power. This power can\'t be used if Smeargle ' +
      'is affected by a Special Condition.'
  }];

  public attacks = [
    {
      name: 'Tail Rap',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 20,
      text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
    }
  ];

  public set: string = 'HGSS';

  public name: string = 'Smeargle';

  public fullName: string = 'Smeargle UND';

}
