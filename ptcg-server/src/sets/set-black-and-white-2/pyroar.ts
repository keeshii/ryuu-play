import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State, GamePhase } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { PowerEffect, UsePowerEffect, AttackEffect } from "../../game/store/effects/game-effects";
import { PowerType } from "../../game/store/card/pokemon-types";
import { StateUtils } from "../../game/store/state-utils";
import { GameMessage, GameError } from "../../game/game-error";
import { CheckProvidedEnergyEffect } from "../../game/store/effects/check-effects";
import { ChooseEnergyPrompt } from "../../game/store/prompts/choose-energy-prompt";
import { CardMessage } from "../card-message";
import { Card } from "../../game/store/card/card";
import { DiscardCardsEffect, DealDamageAfterWeaknessEffect } from "../../game/store/effects/attack-effects";

export class Pyroar extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Litleo';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 110;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Intimidating Mane',
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage done to this Pokemon by attacks from your ' +
      'opponent\'s Basic Pokemon.'
  }];

  public attacks = [{
    name: 'Scorching Fang',
    cost: [ CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 60,
    text: 'You may discard a R Energy attached to this Pokemon. If you do, ' +
      'this attack does 30 more damage.'
  }];

  public set: string = 'BW2';

  public name: string = 'Pyroar';

  public fullName: string = 'Pyroar FLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof UsePowerEffect && effect.power === this.powers[0]) {
      throw new GameError(GameMessage.CANNOT_USE_POWER);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        CardMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [ CardType.FIRE ],
        { allowCancel: true }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        if (cards.length > 0) {
          effect.damage += 30;
          const discardEnergy = new DiscardCardsEffect(player, cards,
            effect.attack, player.active, player.active);
          return store.reduceEffect(state, discardEnergy);
        }
      });
    }

    if (effect instanceof DealDamageAfterWeaknessEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();

      // It's not this pokemon card
      if (pokemonCard !== this) {
        return state;
      }

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK || !effect.source.isBasic()) {
        return state;
      }

      const player = StateUtils.findOwner(state, effect.target);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0]);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      effect.preventDefault = true;
    }

    return state;
  }

}
