import { PokemonCard } from '@ptcg/common';
import { Stage, CardType, SpecialCondition } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { AttackEffect } from '@ptcg/common';
import { CoinFlipPrompt } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { PlayerType } from '@ptcg/common';
import { AddSpecialConditionsEffect } from '@ptcg/common';


export class Pachirisu extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 70;

  public weakness = [{
    type: CardType.FIGHTING,
    value: 20
  }];

  public resistance = [{
    type: CardType.METAL,
    value: -20
  }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Thunder Wave',
    cost: [ CardType.LIGHTNING ],
    damage: '10',
    text: 'Flip a coin. If heads, the Defending Pokemon is now Paralyzed.'
  }, {
    name: 'Poison Berry',
    cost: [ CardType.LIGHTNING, CardType.COLORLESS ],
    damage: '20+',
    text: 'If you have Croagunk in play, this attack does 20 damage plus 20 ' +
      'more damage and the Defending Pokemon is now Poisoned.'
  }];

  public set: string = 'OP9';

  public name: string = 'Pachirisu';

  public fullName: string = 'Pachirisu OP9';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, new CoinFlipPrompt(
        player.id,
        GameMessage.COIN_FLIP
      ), flipResult => {
        if (flipResult) {
          const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialCondition);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      let isCroagunkInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Croagunk') {
          isCroagunkInPlay = true;
        }
      });

      if (isCroagunkInPlay) {
        effect.damage += 20;
        const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
        store.reduceEffect(state, specialCondition);
      }

      return state;
    }

    return state;
  }

}
