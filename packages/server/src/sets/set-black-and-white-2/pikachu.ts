import { PokemonCard } from '@ptcg/common';
import { Stage, CardType, SpecialCondition } from '@ptcg/common';
import { StoreLike, State, CoinFlipPrompt } from '@ptcg/common';
import { AttackEffect } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { AddSpecialConditionsEffect } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';

export class Pikachu extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.METAL, value: -20 }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Nuzzle',
      cost: [ CardType.COLORLESS ],
      damage: 0,
      text: 'Flip a coin. If heads, your opponent\'s Active Pokemon ' +
        'is now Paralyzed.'
    },
    {
      name: 'Quick Attack',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 20,
      text: 'Flip a coin. If heads, this attack does 10 more damage.'
    }
  ];

  public set: string = 'BW2';

  public name: string = 'Pikachu';

  public fullName: string = 'Pikachu XY';

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

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          effect.damage += 10;
        }
      });
    }

    return state;
  }

}
