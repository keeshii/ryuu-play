import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { StoreLike, State, CoinFlipPrompt } from "../../game";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { Effect } from "../../game/store/effects/effect";
import { GameMessage } from "../../game/game-message";

export class Litwick extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 50;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Trip Over',
      cost: [ CardType.PSYCHIC ],
      damage: 10,
      text: 'Flip a coin. If heads, this attack does 10 more damage.'

    }
  ];

  public set: string = 'BW3';

  public name: string = 'Litwick';

  public fullName: string = 'Litwick PFO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
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
