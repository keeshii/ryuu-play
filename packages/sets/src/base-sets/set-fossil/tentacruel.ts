import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Tentacruel extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Tentacool';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Supersonic',
      cost: [CardType.WATER],
      damage: '',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
    },
    {
      name: 'Jellyfish Sting',
      cost: [CardType.WATER, CardType.WATER],
      damage: '10',
      text: 'The Defending Pokémon is now Poisoned.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [];

  public set: string = 'FO';

  public name: string = 'Tentacruel';

  public fullName: string = 'Tentacruel FO';

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
