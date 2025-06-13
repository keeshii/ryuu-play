import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Dunsparce extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Strike and Run',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Search your deck for up to 3 Basic Pokémon and put them onto your Bench. Shuffle your deck afterward. You ' +
        'may switch Dunsparce with 1 of your Benched Pokémon.'
    },
    {
      name: 'Sudden Flash',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: 'Flip a coin. If heads, each Defending Pokémon is now Paralyzed.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Dunsparce';

  public fullName: string = 'Dunsparce SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return state;
    }

    return state;
  }
}
