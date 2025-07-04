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

export class Nuzleaf extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Seedot';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Steady Punch',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20+',
      text: 'Flip a coin. If heads, this attack does 20 damage plus 10 more damage.'
    },
    {
      name: 'Razor Leaf',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Nuzleaf';

  public fullName: string = 'Nuzleaf SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          effect.damage += 10;
        }
      });
    }

    return state;
  }
}
