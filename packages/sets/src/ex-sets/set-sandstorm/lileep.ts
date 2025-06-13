import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Lileep extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Root Fossil';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Influence',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Search your deck for Omanyte, Kabuto, Aerodactyl, Lileep, or Anorith and put up to 2 of them onto your ' +
        'Bench. Shuffle your deck afterward. Treat the new Benched Pokémon as Basic Pokémon.'
    },
    {
      name: 'Time Spiral',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'If your opponent has any Evolved Pokémon in play, choose 1 of them and flip a coin. If heads, remove the ' +
        'highest Stage Evolution card on that Pokémon and have your opponent shuffle it into his or her deck.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Lileep';

  public fullName: string = 'Lileep SS';

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
