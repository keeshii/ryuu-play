import { AttackEffect, UsePowerEffect } from "../../game/store/effects/game-effects";
import { CardMessage } from "../card-message";
import { Effect } from "../../game/store/effects/effect";
import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { OrderCardsPrompt } from "../../game/store/prompts/order-cards-prompt";
import { PlayPokemonEffect } from "../../game/store/effects/play-card-effects";
import { PowerType, StoreLike, State, ConfirmPrompt, GameError, GameMessage } from "../../game";

function* usePsychicRestore(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const target = player.active;

  let wantToUse = false;
  yield store.prompt(state, new ConfirmPrompt(
    effect.player.id,
    CardMessage.PUT_POKEMON_INTO_THE_DECK
  ), result => {
    wantToUse = result;
    next();
  });

  if (!wantToUse) {
    return state;
  }

  yield store.prompt(state, new OrderCardsPrompt(
    player.id,
    CardMessage.CHOOSE_CARDS_ORDER,
    target,
    { allowCancel: true },
  ), order => {
    if (order === null) {
      return state;
    }

    target.applyOrder(order);
    target.moveTo(player.deck);
    next();
  });

  return state;
}

function* useSetUp(next: Function, store: StoreLike, state: State, effect: PlayPokemonEffect): IterableIterator<State> {
  const player = effect.player;
  const cardsToDraw = Math.max(0, 8 - player.hand.cards.length);
  if (cardsToDraw === 0) {
    return state;
  }

  let wantToUse = false;
  yield store.prompt(state, new ConfirmPrompt(
    effect.player.id,
    CardMessage.USE_SET_UP_ABILITY,
  ), result => {
    wantToUse = result;
    next();
  });

  if (!wantToUse) {
    return state;
  }

  player.deck.moveTo(player.hand, cardsToDraw);
  return state;
}

export class Uxie extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 70;

  public weakness = [{ type: CardType.PSYCHIC, value: 20 }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Set Up',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you put Uxie from your hand onto ' +
      'your Bench, you may draw cards until you have 7 cards in your hand.'
  }];

  public attacks = [
    {
      name: 'Psychic Restore',
      cost: [ CardType.COLORLESS ],
      damage: 20,
      text: 'You may put Uxie and all cards attached to it on the bottom of ' +
        'your deck in any order.'
    }
  ];

  public set: string = 'DP';

  public name: string = 'Uxie LA';

  public fullName: string = 'Uxie LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UsePowerEffect && effect.power === this.powers[0]) {
      throw new GameError(GameMessage.CANNOT_USE_POWER);
    }

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      let generator: IterableIterator<State>;
      generator = useSetUp(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      let generator: IterableIterator<State>;
      generator = usePsychicRestore(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
