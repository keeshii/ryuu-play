import { PokemonCard } from '@ptcg/common';
import { Stage, CardType, SpecialCondition } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { AttackEffect } from '@ptcg/common';
import { CoinFlipPrompt } from '@ptcg/common';
import { AddSpecialConditionsEffect } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';


export class Skrelp extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 50;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Spit Poison',
    cost: [ CardType.PSYCHIC ],
    damage: 0,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokemon ' +
      'is now Poisoned.'
  }];

  public set: string = 'BW2';

  public name: string = 'Skrelp';

  public fullName: string = 'Skrelp FLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
          store.reduceEffect(state, specialCondition);
        }
      });
    }
    return state;
  }

}
