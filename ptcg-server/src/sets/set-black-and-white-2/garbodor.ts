import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { PowerEffect, UsePowerEffect } from "../../game/store/effects/game-effects";
import { PowerType } from "../../game/store/card/pokemon-types";
import { StateUtils } from "../../game/store/state-utils";
import { PlayerType } from "../../game/store/actions/play-card-action";
import { GameMessage, GameError } from "../../game/game-error";

export class Garbodor extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Trubbish';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 100;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Garbotoxin',
    powerType: PowerType.ABILITY,
    text: 'If this Pokemon has a Pokemon Tool card attached to it, ' +
      'each Pokemon in play, in each player\'s hand, and in each ' +
      'player\'s discard pile has no Abilities (except for Garbotoxin).'
  }];

  public attacks = [{
    name: 'Sludge Toss',
    cost: [ CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS ],
    damage: 60,
    text: ''
  }];

  public set: string = 'BW2';

  public name: string = 'Garbodor';

  public fullName: string = 'Garbodor DGE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof UsePowerEffect && effect.power === this.powers[0]) {
      throw new GameError(GameMessage.CANNOT_USE_POWER);
    }

    if (effect instanceof PowerEffect && effect.power.name !== 'Garbotoxin') {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isGarbodorWithToolInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this && cardList.tool !== undefined) {
          isGarbodorWithToolInPlay = true;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this && cardList.tool !== undefined) {
          isGarbodorWithToolInPlay = true;
        }
      });

      if (!isGarbodorWithToolInPlay) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0]);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
    }

    return state;
  }

}
