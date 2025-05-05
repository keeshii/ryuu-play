import { PokemonCard } from '@ptcg/common';
import { Stage, CardType, SpecialCondition } from '@ptcg/common';
import { StoreLike, State, CoinFlipPrompt } from '@ptcg/common';
import { AttackEffect } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { AddSpecialConditionsEffect } from '@ptcg/common';

export class Gothorita extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Gothita';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 80;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Double Slap',
      cost: [ CardType.COLORLESS ],
      damage: 20,
      text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
    },
    {
      name: 'Psybeam',
      cost: [ CardType.PSYCHIC, CardType.COLORLESS ],
      damage: 20,
      text: 'The Defending Pokemon is now Confused.'
    },
  ];

  public set: string = 'BW3';

  public name: string = 'Gothorita';

  public fullName: string = 'Gothorita LT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 20 * heads;
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }

}
