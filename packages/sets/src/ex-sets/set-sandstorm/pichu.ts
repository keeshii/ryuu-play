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

export class Pichu extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 40;

  public powers = [
    {
      name: 'Baby Evolution',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), you may put Pikachu from your hand onto Pichu (this counts as ' +
        'evolving Pichu) and remove all damage counters from Pichu.'
    },
  ];

  public attacks = [
    {
      name: 'Energy Retrieval',
      cost: [CardType.LIGHTNING],
      damage: '',
      text:
        'Search your discard pile for up to 2 basic Energy cards and attach them to 1 of your Pokémon. Put 1 damage ' +
        'counter on that Pokémon for each Energy card attached in this way.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Pichu';

  public fullName: string = 'Pichu SS';

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
