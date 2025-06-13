import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Dusclops extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Duskull';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Judgement',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '',
      text: 'Flip 2 coins. If both of them are heads, the Defending Pokémon is Knocked Out.'
    },
    {
      name: 'Random Curse',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text: 'Put a total of 5 damage counters on all Defending Pokémon in any way you like.'
    },
  ];

  public weakness = [
    { type: CardType.DARK }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Dusclops';

  public fullName: string = 'Dusclops SS';

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
