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

export class Doduo extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 40;

  public attacks = [
    {
      name: 'Run Around',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'Switch Doduo with 1 of your Benched Pokémon.'
    },
    {
      name: 'Random Peck',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '10+',
      text: 'Flip 2 coins. This attack does 10 damage plus 10 more damage for each heads.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Doduo';

  public fullName: string = 'Doduo RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const switchDamageFirst = commonAttacks.switchDamageFirst(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return switchDamageFirst.use(effect, false);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      return store.prompt(
        state,
        [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)],
        results => {
          let heads: number = 0;
          results.forEach(r => {
            heads += r ? 1 : 0;
          });
          effect.damage += 10 * heads;
        }
      );
    }

    return state;
  }
}
