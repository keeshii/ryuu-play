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

export class TyphlosionEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Quilava';

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 160;

  public attacks = [
    {
      name: 'Ring of Fire',
      cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40',
      text: 'The Defending Pokémon is now Burned, and can\'t retreat until the end of your opponent\'s next turn.'
    },
    {
      name: 'Split Blast',
      cost: [CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
      damage: '100',
      text:
        'Discard 1 Energy card attached to Typhlosion ex. If your opponent has more than 1 Defending Pokémon, you ' +
        'may do 50 damage to each of them instead.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING },
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Typhlosion ex';

  public fullName: string = 'Typhlosion ex SS';

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
