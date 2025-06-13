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

export class Elekid extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 40;

  public powers = [
    {
      name: 'Baby Evolution',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), you may put Electabuzz from your hand onto Elekid (this counts ' +
        'as evolving Elekid) and remove all damage counters from Elekid.'
    },
  ];

  public attacks = [
    {
      name: 'Gather Energy',
      cost: [CardType.LIGHTNING],
      damage: '',
      text: 'Search your deck for a basic Energy card and attach it to 1 of your Pokémon. Shuffle your deck afterward.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Elekid';

  public fullName: string = 'Elekid SS';

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
