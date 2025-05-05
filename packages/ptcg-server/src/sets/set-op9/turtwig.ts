import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { HealTargetEffect, AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';


export class Turtwig extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 60;

  public weakness = [{
    type: CardType.FIRE,
    value: 10
  }];

  public resistance = [{
    type: CardType.WATER,
    value: -20
  }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Absorb',
    cost: [ CardType.GRASS ],
    damage: 10,
    text: 'Remove 1 damage counter from Turtwig.'
  }, {
    name: 'Parboil',
    cost: [ CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 40,
    text: 'If you have Chimchar in play, this attack does 40 damage plus 20 ' +
      'more damage and the Defending Pokemon is now Burned.'
  }];

  public set: string = 'OP9';

  public name: string = 'Turtwig';

  public fullName: string = 'Turtwig OP9';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const healEffect = new HealTargetEffect(effect, 10);
      healEffect.target = player.active;
      return store.reduceEffect(state, healEffect);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      let isChimcharInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Chimchar') {
          isChimcharInPlay = true;
        }
      });

      if (isChimcharInPlay) {
        effect.damage += 20;
        const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.BURNED]);
        store.reduceEffect(state, specialCondition);
      }
    }

    return state;
  }

}
