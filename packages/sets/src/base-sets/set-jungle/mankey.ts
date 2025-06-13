import {
  CardType,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Mankey extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 30;

  public powers = [
    {
      name: 'Peek',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), you may look at one of the following: the top card of either ' +
        'player\'s deck, a random card from your opponent\'s hand, or one of either player\'s Prizes. This power can\'t ' +
        'be used if Mankey is Asleep, Confused, or Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Scratch',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [];

  public set: string = 'JU';

  public name: string = 'Mankey';

  public fullName: string = 'Mankey JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      return state;
    }

    return state;
  }
}
