import { Card } from "./card";
import { SuperType, Stage, PokemonType, CardType } from "./card-types";
import { Attack, Weakness, Resistance, Power } from "./pokemon-types";


export abstract class PokemonCard extends Card {

  public superType: SuperType = SuperType.POKEMON;

  public cardType: CardType = CardType.NONE;

  public pokemonType: PokemonType = PokemonType.NORMAL;

  public evolvesFrom: string = '';

  public stage: Stage = Stage.BASIC;

  public retreat: CardType[] = [];

  public hp: number = 0;

  public weakness: Weakness[] = [];
  
  public resistance: Resistance[] = [];

  public powers: Power[] = [];

  public attacks: Attack[] = [];

}
