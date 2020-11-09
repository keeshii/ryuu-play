import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, SpecialCondition } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { PowerEffect, AttackEffect } from "../../game/store/effects/game-effects";
import { PowerType } from "../../game/store/card/pokemon-types";
import { GameError } from "../../game/game-error";
import { GameMessage } from "../../game/game-message";
import { EndTurnEffect } from "../../game/store/effects/game-phase-effects";
import { PlayPokemonEffect } from "../../game/store/effects/play-card-effects";
import { CardList } from "../../game/store/state/card-list";
import { ChooseCardsPrompt } from "../../game/store/prompts/choose-cards-prompt";
import {AddSpecialConditionsEffect} from "../../game/store/effects/attack-effects";


export class Musharna extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Munna';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 100;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Forewarn',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may look at ' +
      'the top 2 cards of your deck, choose 1 of them, and put it into ' +
      'your hand. Put the other card back on top of your deck.'
  }];

  public attacks = [{
    name: 'Fluffy Dream',
    cost: [ CardType.PSYCHIC, CardType.PSYCHIC ],
    damage: 40,
    text: 'This Pokemon is now Asleep.'
  }];

  public set: string = 'BW2';

  public name: string = 'Musharna';

  public fullName: string = 'Musharna NXD';

  public readonly FOREWARN_MARKER = 'FOREWARN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.FOREWARN_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      specialConditionEffect.target = player.active;
      store.reduceEffect(state, specialConditionEffect);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.FOREWARN_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      player.marker.addMarker(this.FOREWARN_MARKER, this);

      const deckTop = new CardList();
      deckTop.cards = player.deck.cards.slice(0, 2);

      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_HAND,
        deckTop,
        { },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        player.deck.moveCardsTo(selected, player.hand);
      });
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.FOREWARN_MARKER, this);
    }

    return state;
  }

}
