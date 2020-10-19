import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, SpecialCondition } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { PowerEffect, AttackEffect, RetreatEffect, UsePowerEffect } from "../../game/store/effects/game-effects";
import { PowerType } from "../../game/store/card/pokemon-types";
import { StateUtils } from "../../game/store/state-utils";
import { GameMessage, GameError } from "../../game/game-error";
import { CoinFlipPrompt } from "../../game/store/prompts/coin-flip-prompt";
import { CardMessage } from "../card-message";
import { PlayerType } from "../../game/store/actions/play-card-action";

export class Dragalge extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Skrelp';

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 100;

  public weakness = [{ type: CardType.FAIRY }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Poison Barrier',
    powerType: PowerType.ABILITY,
    text: 'Your opponent\'s Poisoned Pokemon can\'t retreat.'
  }];

  public attacks = [{
    name: 'Poison Breath',
    cost: [ CardType.WATER, CardType.PSYCHIC, CardType.COLORLESS ],
    damage: 60,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokemon ' +
      'is now Poisoned.'
  }];

  public set: string = 'BW2';

  public name: string = 'Dragalge';

  public fullName: string = 'Dragalge FLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof UsePowerEffect && effect.power === this.powers[0]) {
      throw new GameError(GameMessage.CANNOT_USE_POWER);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, CardMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          opponent.active.addSpecialCondition(SpecialCondition.POISONED);
        }
      });
    }

    // Block retreat for opponent's poisoned Pokemon.
    if (effect instanceof RetreatEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const isPoisoned = player.active.specialConditions.includes(SpecialCondition.POISONED);
      if (!isPoisoned) {
        return state;
      }

      let isDragalgeInPlay = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          isDragalgeInPlay = true;
        }
      });

      if (isDragalgeInPlay) {
        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const powerEffect = new PowerEffect(opponent, this.powers[0]);
          store.reduceEffect(state, powerEffect);
        } catch {
          return state;
        }
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    return state;
  }

}
