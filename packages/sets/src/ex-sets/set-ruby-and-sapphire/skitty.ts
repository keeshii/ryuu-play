import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Skitty extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 40;

  public attacks = [
    {
      name: 'Minor Errand-Running',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Search your deck for 2 basic Energy cards, show them to your opponent, and put them into your hand. ' +
        'Shuffle your deck afterward. '
    },
    {
      name: 'Lullaby',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: 'The Defending Pokémon is now Asleep.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Skitty';

  public fullName: string = 'Skitty RS';

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
