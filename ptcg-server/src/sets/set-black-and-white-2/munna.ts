import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, SpecialCondition } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { PowerEffect } from "../../game/store/effects/game-effects";
import { PowerType } from "../../game/store/card/pokemon-types";
import { StateUtils } from "../../game/store/state-utils";
import { GameError } from "../../game/game-error";
import { GameMessage } from "../../game/game-message";
import { CoinFlipPrompt } from "../../game/store/prompts/coin-flip-prompt";
import { EndTurnEffect } from "../../game/store/effects/game-phase-effects";
import { PlayPokemonEffect } from "../../game/store/effects/play-card-effects";

export class Munna extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 60;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Long-Distance Hypnosis',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may flip a coin. ' +
      'If heads, your opponent\'s Active Pokemon is now Asleep. ' +
      'If tails, your Active Pokemon is now Asleep.'
  }];

  public attacks = [{
    name: 'Psyshot',
    cost: [ CardType.PSYCHIC, CardType.COLORLESS ],
    damage: 20,
    text: ''
  }];

  public set: string = 'BW2';

  public name: string = 'Munna';

  public fullName: string = 'Munna BC';

  public readonly LONG_DISTANCE_HYPNOSIS_MARKER = 'LONG_DISTANCE_HYPNOSIS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.LONG_DISTANCE_HYPNOSIS_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.marker.hasMarker(this.LONG_DISTANCE_HYPNOSIS_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      player.marker.addMarker(this.LONG_DISTANCE_HYPNOSIS_MARKER, this);

      return store.prompt(state, new CoinFlipPrompt(
        player.id,
        GameMessage.COIN_FLIP
      ), result => {
        if (result) {
          opponent.active.addSpecialCondition(SpecialCondition.ASLEEP);
        } else {
          player.active.addSpecialCondition(SpecialCondition.ASLEEP);
        }
      });
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.LONG_DISTANCE_HYPNOSIS_MARKER, this);
    }

    return state;
  }

}
