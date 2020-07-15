import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { PowerType } from "../../game";

export class Hypno extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Drowzee';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 90;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Sleep Pendulum',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may flip a coin. ' +
      'If heads, the Defending Pokemon is now Asleep. This power can\'t be ' +
      'used if Hypno is affected by a Special Condition.'
  }];

  public attacks = [
    {
      name: 'Psychic Shot',
      cost: [ CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 30,
      text: 'Does 10 damage to 1 of your opponent\'s Benched Pokemon. ' +
        '(Don\'t apply Weakness and Resistance for Benched Pokemon.)'
    }
  ];

  public set: string = 'HGSS';

  public name: string = 'Hypno';

  public fullName: string = 'Hypno HGSS';

}
