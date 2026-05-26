import { CardType, Effect, GameError, GameMessage, PokemonCard, PowerEffect, State, StoreLike, SuperType, Weakness } from "@ptcg/common";

// A pokemon card with no types or abilities, used in tests.
export class TestPokemonBlockPowers extends PokemonCard {

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

  public weakness: Weakness[] = [];

  public retreat: CardType[] = [];

  public set: string = 'TEST';

  public name = 'Pokemon Block Powers';

  public fullName = 'Pokemon Block Powers TEST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect) {
      throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
    }
    return state;
  }

}
