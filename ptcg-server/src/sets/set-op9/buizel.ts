import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, SuperType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { CoinFlipPrompt } from "../../game/store/prompts/coin-flip-prompt";
import { GameMessage } from "../../game/game-message";
import { DiscardCardsEffect, AbstractAttackEffect } from "../../game/store/effects/attack-effects";
import { StateUtils } from "../../game/store/state-utils";
import { Card } from "../../game/store/card/card";
import { EnergyCard } from "../../game/store/card/energy-card";
import { ChooseCardsPrompt } from "../../game/store/prompts/choose-cards-prompt";
import { PlayerType } from "../../game/store/actions/play-card-action";
import { EndTurnEffect } from "../../game/store/effects/game-phase-effects";

function* useWhirlpool(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {

  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  // Defending Pokemon has no energy cards attached
  if (!opponent.active.cards.some(c => c instanceof EnergyCard)) {
    return state;
  }

  let flipResult = false;
  yield store.prompt(state, new CoinFlipPrompt(
    player.id, GameMessage.COIN_FLIP
  ), result => {
    flipResult = result;
    next();
  });

  if (!flipResult) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_ENERGY_CARD,
    opponent.active,
    { superType: SuperType.ENERGY },
    { min: 1, max: 1, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  const discardEnergy = new DiscardCardsEffect(effect, cards);
  return store.reduceEffect(state, discardEnergy);
}


export class Buizel extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 60;

  public weakness = [{
    type: CardType.LIGHTNING,
    value: 10
  }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Whirlpool',
    cost: [ CardType.WATER ],
    damage: 0,
    text: 'Flip a coin. If heads, discard an Energy attached to ' +
      'the Defending Pokemon.'
  }, {
    name: 'Super Fast',
    cost: [ CardType.WATER, CardType.WATER ],
    damage: 30,
    text: 'If you have Pachirisu in play, flip a coin. If heads, prevent all ' +
      'effects of an attack, including damage, done to Buizel during your ' +
      'opponent\'s next turn.'
  }];

  public set: string = 'OP9';

  public name: string = 'Buizel';

  public fullName: string = 'Buizel OP9';

  public readonly CLEAR_SUPER_FAST_MARKER = 'CLEAR_SUPER_FAST_MARKER';

  public readonly SUPER_FAST_MARKER = 'SUPER_FAST_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      let generator: IterableIterator<State>;
      generator = useWhirlpool(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      let isPachirisuInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Pachirisu') {
          isPachirisuInPlay = true;
        }
      });

      if (isPachirisuInPlay) {
        const opponent = StateUtils.getOpponent(state, player);
        state = store.prompt(state, new CoinFlipPrompt(
          player.id, GameMessage.COIN_FLIP
        ), flipResult => {
          if (flipResult) {
            player.active.marker.addMarker(this.SUPER_FAST_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_SUPER_FAST_MARKER, this);
          }
        });
      }

      return state;
    }

    if (effect instanceof AbstractAttackEffect
      && effect.target.marker.hasMarker(this.SUPER_FAST_MARKER)) {
      effect.preventDefault = true;
      return state;
    }

    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_SUPER_FAST_MARKER, this)) {

      effect.player.marker.removeMarker(this.CLEAR_SUPER_FAST_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.SUPER_FAST_MARKER, this);
      });
    }

    return state;
  }

}
