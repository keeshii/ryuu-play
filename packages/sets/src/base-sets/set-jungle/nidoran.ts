import {
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

import { commonAttacks } from '../../common';

export class Nidoran extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Fury Swipes',
      cost: [CardType.GRASS],
      damage: '10×',
      text: 'Flip 3 coins. This attack does 10 damage times the number of heads.'
    },
    {
      name: 'Call for Family',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: '',
      text:
        'Search your deck for a Basic Pokémon named Nidoran Male or Nidoran Female and put it onto your Bench. Shuffle your ' +
        'deck afterward. (You can\'t use this attack if your Bench is full.)'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Nidoran Female';

  public fullName: string = 'Nidoran F JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    const callForFamily = commonAttacks.callForFamily(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(
        state,
        [
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
        ],
        results => {
          let heads: number = 0;
          results.forEach(r => {
            heads += r ? 1 : 0;
          });
          effect.damage = 10 * heads;
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return callForFamily.use(effect, [
        { name: 'Nidoran Female' },
        { name: 'Nidoran Male' }
      ]);
    }

    return state;
  }
}
