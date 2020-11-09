import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, SuperType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { PowerEffect } from "../../game/store/effects/game-effects";
import { PowerType } from "../../game/store/card/pokemon-types";
import { StateUtils } from "../../game/store/state-utils";
import { PlayerType, SlotType } from "../../game/store/actions/play-card-action";
import { GameError } from "../../game/game-error";
import { GameMessage } from "../../game/game-message";
import { PlayPokemonEffect } from "../../game/store/effects/play-card-effects";
import { EnergyCard } from "../../game/store/card/energy-card";
import { AttachEnergyPrompt } from "../../game/store/prompts/attach-energy-prompt";
import { EndTurnEffect } from "../../game/store/effects/game-phase-effects";

export class Bronzong extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Bronzor';

  public cardType: CardType = CardType.METAL;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Metal Links',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may attach ' +
    'a M Energy card from your discard pile to 1 of your Benched Pokemon.'
  }];

  public attacks = [{
    name: 'Hammer In',
    cost: [ CardType.METAL, CardType.METAL, CardType.COLORLESS ],
    damage: 60,
    text: ''
  }];

  public set: string = 'BW2';

  public name: string = 'Bronzong';

  public fullName: string = 'Bronzong PFO';

  public readonly METAL_LINKS_MAREKER = 'METAL_LINKS_MAREKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.METAL_LINKS_MAREKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      const hasBench = player.bench.some(b => b.cards.length > 0);
      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard && c.provides.includes(CardType.METAL);
      });
      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.METAL_LINKS_MAREKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      player.marker.addMarker(this.METAL_LINKS_MAREKER, this);

      let blocked: number[] = [];
      player.discard.cards.forEach((card, index) => {
        if (card instanceof EnergyCard && !card.provides.includes(CardType.METAL)) {
          blocked.push(index);
        }
      });

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH ],
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 1, max: 1, blocked }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.discard.moveCardTo(transfer.card, target);
        }
      });

      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.METAL_LINKS_MAREKER, this);
    }

    return state;
  }

}
