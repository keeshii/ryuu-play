import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { PowerType, StoreLike, State, StateUtils, GameError, GameMessage,
  PlayerType, ChooseCardsPrompt } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { PowerEffect, AttackEffect } from "../../game/store/effects/game-effects";
import { CardMessage } from "../card-message";
import { EndTurnEffect } from "../../game/store/effects/game-phase-effects";
import { PlayPokemonEffect } from "../../game/store/effects/play-card-effects";

export class Empoleon extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Prinplup';

  public cardType: CardType = CardType.WATER;

  public hp: number = 140;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Diving Draw',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may discard ' +
      'a card from your hand. If you do, draw 2 cards.'
  }];

  public attacks = [
    {
      name: 'Attack Command',
      cost: [ CardType.WATER ],
      damage: 10,
      text: 'Does 10 damage times the number of Pokemon in play (both yours ' +
        'and your opponent\'s).'
    }
  ];

  public set: string = 'BW';

  public name: string = 'Empoleon';

  public fullName: string = 'Empoleon DEX';

  public readonly DIVING_DRAW_MAREKER = 'DIVING_DRAW_MAREKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.DIVING_DRAW_MAREKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      if (player.hand.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.DIVING_DRAW_MAREKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      state = store.prompt(state, new ChooseCardsPrompt(
        player.id,
        CardMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { },
        { allowCancel: true, min: 1, max: 1 }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }
        player.marker.addMarker(this.DIVING_DRAW_MAREKER, this);
        player.hand.moveCardsTo(cards, player.discard);
        player.deck.moveTo(player.hand, 2);
      });

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      let pokemonInPlay = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, () => { pokemonInPlay += 1; });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, () => { pokemonInPlay += 1; });
      effect.damage = 10 * pokemonInPlay;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.DIVING_DRAW_MAREKER, this);
    }

    return state;
  }

}
