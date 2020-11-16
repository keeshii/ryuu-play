import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, SpecialCondition, SuperType } from "../../game/store/card/card-types";
import { PowerType, StoreLike, State, ShuffleDeckPrompt, StateUtils,
  PokemonCardList, Card, ChooseCardsPrompt, GameMessage } from "../../game";
import { AttackEffect, PowerEffect } from "../../game/store/effects/game-effects";
import { Effect } from "../../game/store/effects/effect";
import { PutDamageEffect, AddSpecialConditionsEffect } from "../../game/store/effects/attack-effects";

function* usePlayground(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
  specialCondition.target = player.active;
  store.reduceEffect(state, specialCondition);

  // Player
  let slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
  let max = slots.length;

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
    player.deck,
    { superType: SuperType.POKEMON, stage: Stage.BASIC },
    { min: 0, max, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length > slots.length) {
    cards.length = slots.length;
  }

  cards.forEach((card, index) => {
    player.deck.moveCardTo(card, slots[index]);
    slots[index].pokemonPlayedTurn = state.turn;
  });

  // Opponent
  slots = opponent.bench.filter(b => b.cards.length === 0);
  max = slots.length;

  yield store.prompt(state, new ChooseCardsPrompt(
    opponent.id,
    GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
    opponent.deck,
    { superType: SuperType.POKEMON, stage: Stage.BASIC },
    { min: 0, max, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length > slots.length) {
    cards.length = slots.length;
  }

  cards.forEach((card, index) => {
    opponent.deck.moveCardTo(card, slots[index]);
    slots[index].pokemonPlayedTurn = state.turn;
  });

  // Shuffle decks
  store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });

  store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
    opponent.deck.applyOrder(order);
  });

  return state;
}

export class Pichu extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 30;

  public retreat = [ ];

  public powers = [{
    name: 'Sweet Sleeping Face',
    powerType: PowerType.POKEBODY,
    text: 'As long as Pichu is Asleep, prevent all damage done to Cleffa ' +
      'by attacks.'
  }];

  public attacks = [
    {
      name: 'Playground',
      cost: [ ],
      damage: 0,
      text: 'Each player may search his or her deck for as many Basic ' +
        'Pokemon as he or she likes, put them onto his or her Bench, and ' +
        'shuffle his or her deck afterward. (You put your Pokemon on the ' +
        'Bench first.) Pichu is now Asleep.'
    }
  ];

  public set: string = 'HGSS';

  public name: string = 'Pichu';

  public fullName: string = 'Pichu HGSS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Playground
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      let generator: IterableIterator<State>;
      generator = usePlayground(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    // Sweet Sleeping Face
    if (effect instanceof PutDamageEffect) {
      if (effect.target.cards.includes(this)) {
        const pokemonCard = effect.target.getPokemonCard();
        const isAsleep = effect.target.specialConditions.includes(SpecialCondition.ASLEEP);
        if (pokemonCard === this && isAsleep) {
          // Try to reduce PowerEffect, to check if something is blocking our ability
          try {
            const powerEffect = new PowerEffect(effect.player, this.powers[0], this);
            store.reduceEffect(state, powerEffect);
          } catch {
            return state;
          }
          effect.preventDefault = true;
        }
      }
    }

    return state;
  }

}
