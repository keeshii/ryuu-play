import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { PowerType, StoreLike, State, StateUtils, PlayerType, CoinFlipPrompt } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { CardMessage } from "../card-message";
import { AttachEnergyEffect } from "../../game/store/effects/play-card-effects";
import { EndTurnEffect } from "../../game/store/effects/game-phase-effects";
import { DealDamageAfterWeaknessEffect } from "../../game/store/effects/attack-effects";

export class Shuckle extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 60;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Fermenting Liquid',
    powerType: PowerType.POKEBODY,
    text: 'Whenever you attach an Energy card from your hand to Shuckle, ' +
      'draw a card.'
  }];

  public attacks = [
    {
      name: 'Shell Stunner',
      cost: [ CardType.GRASS, CardType.COLORLESS ],
      damage: 20,
      text: 'Flip a coin. If heads, prevent all damage done to Shuckle by ' +
        'attacks during your opponent\'s next turn.'
    }
  ];

  public set: string = 'BW';

  public name: string = 'Shuckle';

  public fullName: string = 'Shuckle PR';

  public readonly SHELL_STUNNER_MAREKER = 'SHELL_STUNNER_MAREKER';

  public readonly CLEAR_SHELL_STUNNER_MAREKER = 'CLEAR_SHELL_STUNNER_MAREKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttachEnergyEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
      if (pokemonCard === this) {
        const player = effect.player;
        player.deck.moveTo(player.hand, 1);
      }
      return state;
    }

    if (effect instanceof DealDamageAfterWeaknessEffect
      && effect.target.marker.hasMarker(this.SHELL_STUNNER_MAREKER)) {
      effect.preventDefault = true;
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      state = store.prompt(state, new CoinFlipPrompt(
        player.id,
        CardMessage.COIN_FLIP
      ), flipResult => {
        if (flipResult) {
          player.active.marker.addMarker(this.SHELL_STUNNER_MAREKER, this);
          opponent.marker.addMarker(this.CLEAR_SHELL_STUNNER_MAREKER, this);
        }
      });

      return state;
    }

    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_SHELL_STUNNER_MAREKER, this)) {

      effect.player.marker.removeMarker(this.CLEAR_SHELL_STUNNER_MAREKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.SHELL_STUNNER_MAREKER, this);
      });
    }

    return state;
  }

}
