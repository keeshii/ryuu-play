import { PokemonCard } from '@ptcg/common';
import { Stage, CardType } from '@ptcg/common';
import { StoreLike, State, CoinFlipPrompt } from '@ptcg/common';
import { AttackEffect } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';

export class Gothita extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 50;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Trip Over',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 10,
      text: 'Flip a coin. If heads, this attack does 20 more damage.'

    }
  ];

  public set: string = 'BW3';

  public name: string = 'Gothita';

  public fullName: string = 'Gothita LT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          effect.damage += 20;
        }
      });
    }

    return state;
  }

}
