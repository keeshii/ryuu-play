import { Card } from './card';
import { SuperType, Stage, CardType } from './card-types';
import { Attack, Weakness, Resistance, Power } from './pokemon-types';


export abstract class PokemonCard extends Card {

  public superType: SuperType = SuperType.POKEMON;

  public cardTypes: CardType[] = [];

  public evolvesFrom: string = '';

  public stage: Stage = Stage.BASIC;

  public retreat: CardType[] = [];

  public hp: number = 0;

  public weakness: Weakness[] = [];
  
  public resistance: Resistance[] = [];

  public powers: Power[] = [];

  public attacks: Attack[] = [];

}
