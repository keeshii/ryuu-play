import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { StoreLike, State, CoinFlipPrompt } from "../../game";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { Effect } from "../../game/store/effects/effect";
import { CardMessage } from "../card-message";
import { HealTargetEffect, RemoveSpecialConditionsEffect } from "../../game/store/effects/attack-effects";

export class Roselia extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 70;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.WATER, value: -20 }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Double Whip',
      cost: [ CardType.COLORLESS ],
      damage: 10,
      text: 'Flip 2 coins. This attack does 10 damage times the number ' +
        'of heads.'
    },
    {
      name: 'Relaxing Fragrance',
      cost: [ CardType.GRASS ],
      damage: 0,
      text: 'Heal 30 damage and remove all Special Conditions from ' +
        'this Pokemon.'
    }
  ];

  public set: string = 'BW2';

  public name: string = 'Roselia';

  public fullName: string = 'Roselia DGE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      state = store.prompt(state, [
        new CoinFlipPrompt(player.id, CardMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, CardMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 10 * heads;
      });
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const target = effect.player.active;

      const healTargetEffect = new HealTargetEffect(player, 30,
        effect.attack, target, target);
      state = store.reduceEffect(state, healTargetEffect);

      const removeSpecialConditionsEffect = new RemoveSpecialConditionsEffect(
        player, undefined, effect.attack, target, target);
      state = store.reduceEffect(state, removeSpecialConditionsEffect);
      return state;
    }

    return state;
  }

}
