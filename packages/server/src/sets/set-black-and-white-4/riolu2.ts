import { PokemonCard } from '@ptcg/common';
import { Stage, CardType } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { AttackEffect } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { CoinFlipPrompt } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';

export class Riolu2 extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 70;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Punch',
    cost: [ CardType.COLORLESS ],
    damage: 10,
    text: ''
  }, {
    name: 'Quick Attack',
    cost: [ CardType.FIGHTING, CardType.COLORLESS ],
    damage: 10,
    text: 'Flip a coin. If heads, this attack does 20 more damage.'
  }];

  public set: string = 'BW4';

  public name: string = 'Riolu';

  public fullName: string = 'Riolu LT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
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
