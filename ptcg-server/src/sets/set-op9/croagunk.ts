import { Card } from "../../game/store/card/card";
import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { CoinFlipPrompt } from "../../game/store/prompts/coin-flip-prompt";
import { CardMessage } from "../card-message";
import { StateUtils } from "../../game/store/state-utils";
import { PlayerType } from "../../game/store/actions/play-card-action";
import { DealDamageAfterWeaknessEffect } from "../../game/store/effects/attack-effects";
import { ChooseCardsPrompt } from "../../game/store/prompts/choose-cards-prompt";


function* useKnockOff(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {

  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  // Opponent has no cards in the hand
  if (opponent.hand.cards.length === 0) {
    return state;
  }

  let flipResult = false;
  yield store.prompt(state, new CoinFlipPrompt(
    player.id, CardMessage.COIN_FLIP
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
    CardMessage.CHOOSE_ANY_CARD,
    opponent.hand,
    { },
    { min: 1, max: 1, allowCancel: false, isSecret: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  opponent.hand.moveCardsTo(cards, opponent.discard);
  return state;
}



export class Croagunk extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 60;

  public weakness = [{
    type: CardType.PSYCHIC,
    value: 10
  }];

  public retreat = [ CardType.COLORLESS,  CardType.COLORLESS ];

  public attacks = [{
    name: 'Knock Off',
    cost: [ CardType.COLORLESS ],
    damage: 0,
    text: 'Flip a coin. If heads, choose 1 card from your opponent\'s hand ' +
      'without looking and discard it.'
  }, {
    name: 'Nimble',
    cost: [ CardType.PSYCHIC, CardType.PSYCHIC ],
    damage: 30,
    text: 'If you have Turtwig in play, remove from Croagunk the number of ' +
      'damage counters equal to the damage you did to the Defending Pokemon.'
  }];

  public set: string = 'OP9';

  public name: string = 'Croagunk';

  public fullName: string = 'Croagunk OP9';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      let generator: IterableIterator<State>;
      generator = useKnockOff(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof DealDamageAfterWeaknessEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      return store.waitPrompt(state, () => {
        let isTurtwigInPlay = false;
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          if (card.name === 'Turtwig') {
            isTurtwigInPlay = true;
          }
        });

        if (effect.preventDefault || !isTurtwigInPlay) {
          return;
        }

        const heal = Math.min(player.active.damage, effect.damage);
        player.active.damage -= heal;
      });
    }

    return state;
  }

}
