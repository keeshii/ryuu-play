import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Wynaut extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 50;

  public powers = [
    {
      name: 'Baby Evolution',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), you may put Wobbuffet from your hand onto Wynaut (this counts ' +
        'as evolving Wynaut), and remove all damage counters from Wynaut.'
    },
  ];

  public attacks = [
    {
      name: 'Alluring Smile',
      cost: [CardType.PSYCHIC],
      damage: '',
      text:
        'Search your deck for a Basic Pokémon card or Evolution card for each Energy attached to Wynaut, show them ' +
        'to your opponent, and put them into your hand. Shuffle your deck afterward.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Wynaut';

  public fullName: string = 'Wynaut SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
