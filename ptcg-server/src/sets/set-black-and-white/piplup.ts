import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { StoreLike, State, CoinFlipPrompt } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { CardMessage } from "../card-message";

export class Piplup extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 60;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Fury Attack',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 20,
      text: 'Flip 3 coins. This attack does 10 damage times the number of heads.'
    }
  ];

  public set: string = 'BW';

  public name: string = 'Piplup';

  public fullName: string = 'Piplup DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, CardMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, CardMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, CardMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 10 * heads;
      });
    }

    return state;
  }

}
