import {
  AttackEffect,
  CardList,
  CardType,
  ConfirmPrompt,
  Effect,
  GameMessage,
  OrderCardsPrompt,
  PlayPokemonEffect,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

function* usePsychicRestore(
  next: Function,
  store: StoreLike,
  state: State,
  effect: AttackEffect
): IterableIterator<State> {
  const player = effect.player;
  const target = player.active;

  let wantToUse = false;
  yield store.prompt(
    state,
    new ConfirmPrompt(effect.player.id, GameMessage.WANT_TO_SHUFFLE_POKEMON_INTO_DECK),
    result => {
      wantToUse = result;
      next();
    }
  );

  if (!wantToUse) {
    return state;
  }

  const cardList = new CardList();
  target.moveTo(cardList);

  return store.prompt(
    state,
    new OrderCardsPrompt(player.id, GameMessage.CHOOSE_CARDS_ORDER, cardList, {
      allowCancel: true,
    }),
    order => {
      if (order !== null) {
        cardList.applyOrder(order);
      }
      cardList.moveTo(player.deck);
    }
  );
}

export class Uxie extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 70;

  public weakness = [{ type: CardType.PSYCHIC, value: 20 }];

  public retreat = [CardType.COLORLESS];

  public powers = [
    {
      name: 'Set Up',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn, when you put Uxie from your hand onto ' +
        'your Bench, you may draw cards until you have 7 cards in your hand.',
    },
  ];

  public attacks = [
    {
      name: 'Psychic Restore',
      cost: [CardType.COLORLESS],
      damage: '20',
      text: 'You may put Uxie and all cards attached to it on the bottom of your deck in any order.',
    },
  ];

  public set: string = 'DP';

  public name: string = 'Uxie LA';

  public fullName: string = 'Uxie LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const cards = player.hand.cards.filter(c => c !== this);
      const cardsToDraw = Math.max(0, 7 - cards.length);
      if (cardsToDraw === 0) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      return store.prompt(state, new ConfirmPrompt(effect.player.id, GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
        if (wantToUse) {
          player.deck.moveTo(player.hand, cardsToDraw);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = usePsychicRestore(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
