import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, CardTag } from "../../game/store/card/card-types";
import { PowerType } from "../../game";

export class CrobatG extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public tags = [ CardTag.POKEMON_SP ];

  public hp: number = 80;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [ ];

  public powers = [{
    name: 'Flash Bite',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you put Crobat G from your hand ' +
      'onto your Bench, you may put 1 damage counter on 1 of your ' +
      'opponent\'s Pokémon.'
  }];

  public attacks = [
    {
      name: 'Toxic Fang',
      cost: [ CardType.PSYCHIC, CardType.COLORLESS ],
      damage: 0,
      text: 'The Defending Pokémon is now Poisoned. Put 2 damage counters ' +
      ' instead of 1 on the Defending Pokémon between turns.'
    }
  ];

  public set: string = 'DP';

  public name: string = 'Crobat G';

  public fullName: string = 'Crobat G PL';

}
