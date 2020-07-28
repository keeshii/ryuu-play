import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { StoreLike, State, CoinFlipPrompt } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { CardMessage } from "../card-message";

export class Prinplup extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Piplup';

  public cardType: CardType = CardType.WATER;

  public hp: number = 80;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Razor Wing',
      cost: [ CardType.COLORLESS ],
      damage: 20,
      text: ''
    },
    {
      name: 'Fury Attack',
      cost: [ CardType.WATER, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 30,
      text: 'Flip 3 coins. This attack does 30 damage times the number of heads.'
    }
  ];

  public set: string = 'BW';

  public name: string = 'Prinplup';

  public fullName: string = 'Prinplup DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, CardMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, CardMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, CardMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 30 * heads;
      });
    }

    return state;
  }

}
