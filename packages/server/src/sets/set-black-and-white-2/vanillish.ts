import { PokemonCard } from '@ptcg/common';
import { Stage, CardType, SpecialCondition } from '@ptcg/common';
import { StoreLike, State, CoinFlipPrompt } from '@ptcg/common';
import { AttackEffect } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { AddSpecialConditionsEffect } from '@ptcg/common';

export class Vanillish extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Vanillite';

  public cardType: CardType = CardType.WATER;

  public hp: number = 80;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Ice Beam',
      cost: [ CardType.WATER, CardType.COLORLESS ],
      damage: 20,
      text: 'Flip a coin. If heads, the Defending Pokemon is now Paralyzed.'
    },
    {
      name: 'Frost Breath',
      cost: [ CardType.WATER, CardType.WATER ],
      damage: 40,
      text: ''
    }
  ];

  public set: string = 'BW2';

  public name: string = 'Vanillish';

  public fullName: string = 'Vanillish NV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    return state;
  }

}
