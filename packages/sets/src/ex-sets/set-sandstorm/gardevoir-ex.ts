import {
  AttackEffect,
  CardTag,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class GardevoirEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Kirlia';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 150;

  public attacks = [
    {
      name: 'Feedback',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '',
      text:
        'Count the number of cards in your opponent\'s hand. Put that many damage counters on the Defending Pokémon.'
    },
    {
      name: 'Psystorm',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '10×',
      text: 'Does 10 damage times the total amount of Energy attached to all Pokémon in play.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS },
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Gardevoir ex';

  public fullName: string = 'Gardevoir ex SS';

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
