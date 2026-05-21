import { CardType, CheckAttackCostEffect, Effect, PokemonCard, State, StoreLike, SuperType } from "@ptcg/common";

// A pokemon card with no types or abilities, used in tests.
export class TestPokemonIgnoreAttackCost extends PokemonCard {

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

  public name = 'Pokemon Ignore Attack Cost';

  public fullName = 'Pokemon Ignore Attack Cost TEST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckAttackCostEffect) {
      effect.cost = [];
    }
    return state;
  }

}
