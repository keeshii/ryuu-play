import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, SpecialCondition } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State, GamePhase } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect, KnockOutEffect } from "../../game/store/effects/game-effects";
import { GameMessage } from "../../game/game-message";
import { CoinFlipPrompt } from "../../game/store/prompts/coin-flip-prompt";
import { PowerType } from "../../game/store/card/pokemon-types";
import { AddSpecialConditionsEffect } from "../../game/store/effects/attack-effects";
import { StateUtils } from "../../game/store/state-utils";

export class Articuno extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 120;

  public weakness = [{ type: CardType.METAL }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Delta Plus',
    powerType: PowerType.ANCIENT_TRAIT,
    text: 'If your opponent\'s Pokemon is Knocked Out by damage from an ' +
      'attack of this Pokemon, take 1 more Prize card.'
  }];

  public attacks = [{
    name: 'Chilling Sigh',
    cost: [ CardType.WATER ],
    damage: 0,
    text: 'Your opponent\'s Active Pokemon is now Asleep.'
  }, {
    name: 'Tri Edge',
    cost: [ CardType.WATER, CardType.WATER, CardType.COLORLESS ],
    damage: 20,
    text: 'Flip 3 coins. This attack does 40 more damage for each heads.'
  }];

  public set: string = 'BW3';

  public name: string = 'Articuno';

  public fullName: string = 'Articuno ROS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialConditionEffect);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage += 40 * heads;
      });
    }

    // Delta Plus
    if (effect instanceof KnockOutEffect && effect.target === effect.player.active) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      // Articuno wasn't attacking
      const pokemonCard = opponent.active.getPokemonCard();
      if (pokemonCard !== this) {
        return state;
      }

      effect.prizeCount += 1;
      return state;
    }

    return state;
  }

}
