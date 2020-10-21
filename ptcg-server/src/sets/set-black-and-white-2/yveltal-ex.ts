import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, SuperType } from "../../game/store/card/card-types";
import { StoreLike, State, StateUtils, AttachEnergyPrompt, PlayerType, SlotType } from "../../game";
import { KnockOutEffect, AttackEffect } from "../../game/store/effects/game-effects";
import { Effect } from "../../game/store/effects/effect";
import { CheckProvidedEnergyEffect } from "../../game/store/effects/check-effects";
import { CardMessage } from "../card-message";

export class YveltalEx extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 170;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Evil Ball',
      cost: [ CardType.DARK, CardType.COLORLESS ],
      damage: 20,
      text: 'This attack does 20 more damage times the amount of Energy ' +
        'attached to both Active Pokemon.'
    }, {
      name: 'Y Cyclone',
      cost: [ CardType.DARK, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 90,
      text: 'Move an Energy from this Pokemon to 1 of your Benched Pokemon.'
    },
  ];

  public set: string = 'BW2';

  public name: string = 'Yveltal EX';

  public fullName: string = 'Yveltal EX XY';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const playerProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, playerProvidedEnergy);
      const playerEnergyCount = playerProvidedEnergy.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      const opponentProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, opponentProvidedEnergy);
      const opponentEnergyCount = playerProvidedEnergy.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      effect.damage += (playerEnergyCount + opponentEnergyCount) * 20;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        CardMessage.ATTACH_ENERGY_TO_BENCH,
        player.active,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH ],
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 1, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.active.moveCardTo(transfer.card, target);
        }
      });
    }

    // Pokemon ex rule
    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {
      effect.prizeCount += 1;
    }

    return state;
  }

}