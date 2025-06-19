import { CardType, PokemonCard, SuperType } from "@ptcg/common";

// A pokemon card with no types or abilities, used in tests.
export class TestPokemon extends PokemonCard {

  public superType: SuperType = SuperType.POKEMON;

  public cardTypes: CardType[] = [];

  public hp: number = 400;

  public attacks = [
    {
      name: 'Test attack',
      cost: [],
      damage: '10',
      text: ''
    },
  ];

  public weakness = [];

  public retreat = [];

  public set: string = 'TEST';

  public name = 'Pokemon';

  public fullName = 'Pokemon TEST';

}
