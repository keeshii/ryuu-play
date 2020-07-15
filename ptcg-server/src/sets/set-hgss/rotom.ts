import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { PowerType } from "../../game";

export class Rotom extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 60;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.LIGHTNING, value: -20 }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Mischievous Trick',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may switch 1 of ' +
      'your face-down Prize cards with the top card of your deck. ' +
      'This power can\'t be used if Rotom is affected by a Special Condition.'
  }];

  public attacks = [
    {
      name: 'Plasma Arrow',
      cost: [ CardType.LIGHTNING ],
      damage: 0,
      text: 'Choose 1 of your opponent\'s Pokemon. This attack does 20 ' +
        'damage for each Energy attached to that Pokemon. This attack\'s ' +
        'damage isn\'t affected by Weakness or Resistance.'
    }
  ];

  public set: string = 'HGSS';

  public name: string = 'Rotom';

  public fullName: string = 'Rotom UND';

}
