import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { GameMessage } from '../../game/game-message';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';


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
