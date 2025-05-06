import { PokemonCard } from '@ptcg/common';
import { Stage, CardType, SpecialCondition } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { AttackEffect } from '@ptcg/common';
import { CoinFlipPrompt } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { AddSpecialConditionsEffect } from '@ptcg/common';


export class Vanilluxe extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Vanillish';

  public cardType: CardType = CardType.WATER;

  public hp: number = 130;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [{
    name: 'Double Freeze',
    cost: [ CardType.WATER, CardType.COLORLESS ],
    damage: 40,
    text: 'Flip 2 coins. This attack does 40 damage times the number of heads. ' +
      'If either of them is heads, the Defending Pokemon is now Paralyzed.'
  },
  {
    name: 'Frost Breath',
    cost: [ CardType.WATER, CardType.WATER ],
    damage: 60,
    text: ''
  }];

  public set: string = 'BW2';

  public name: string = 'Vanilluxe';

  public fullName: string = 'Vanilluxe NV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });

        effect.damage = 40 * heads;
        if (heads > 0) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    return state;
  }

}
