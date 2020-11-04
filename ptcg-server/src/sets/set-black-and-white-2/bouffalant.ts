import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, CardTag } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State, GamePhase } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { PowerEffect, UsePowerEffect, AttackEffect } from "../../game/store/effects/game-effects";
import { PutDamageEffect } from "../../game/store/effects/attack-effects";
import { PowerType } from "../../game/store/card/pokemon-types";
import { StateUtils } from "../../game/store/state-utils";
import { GameError } from "../../game/game-error";
import { GameMessage } from "../../game/game-message";

export class Bouffalant extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 100;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Bouffer',
    powerType: PowerType.ABILITY,
    text: 'Any damage done to this Pokemon by attacks is reduced by 20 ' +
      '(after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Gold Breaker',
    cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 60,
    text: 'If the Defending Pokemon is a Pokemon-EX, ' +
      'this attack does 60 more damage.'
  }];

  public set: string = 'BW2';

  public name: string = 'Bouffalant';

  public fullName: string = 'Bouffalant DGE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof UsePowerEffect && effect.power === this.powers[0]) {
      throw new GameError(GameMessage.CANNOT_USE_POWER);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const defending = opponent.active.getPokemonCard();
      if (defending && defending.tags.includes(CardTag.POKEMON_EX)) {
        effect.damage += 60;
      }
    }

    // Reduce damage by 20
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();

      // It's not this pokemon card
      if (pokemonCard !== this) {
        return state;
      }

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      const player = StateUtils.findOwner(state, effect.target);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      effect.damage = Math.max(0, effect.damage - 20);
    }

    return state;
  }

}
