import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, SpecialCondition } from "../../game/store/card/card-types";
import { StoreLike, State, CoinFlipPrompt } from "../../game";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { Effect } from "../../game/store/effects/effect";
import { GameMessage } from "../../game/game-message";
import { AddSpecialConditionsEffect } from "../../game/store/effects/attack-effects";

export class Kirlia extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Ralts';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 80;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Psy Bolt',
      cost: [ CardType.PSYCHIC ],
      damage: 20,
      text: 'Flip a coin. If heads, the Defending Pokemon is now Paralyzed.'
    }
  ];

  public set: string = 'BW3';

  public name: string = 'Kirlia';

  public fullName: string = 'Kirlia PS';

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

    return state;
  }

}
