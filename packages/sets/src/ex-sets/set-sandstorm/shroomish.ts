import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Shroomish extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 40;

  public attacks = [
    {
      name: 'Growth Spurt',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'Attach a G Energy card from your hand to Shroomish.'
    },
    {
      name: 'Poisonpowder',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: '10',
      text: 'The Defending Pokémon is now Poisoned.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public resistance = [
    { type: CardType.WATER, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Shroomish';

  public fullName: string = 'Shroomish SS';

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
