import {
  AttackEffect,
  Card,
  CardType,
  ChooseCardsPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  ShuffleDeckPrompt,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType
} from '@ptcg/common';

function* useAfternoonNap(next: Function, store: StoreLike, state: State, self: Slowpoke, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const pokemonSlot = StateUtils.findPokemonSlot(state, self);

  if (!pokemonSlot) {
    return state;
  }

  if (player.deck.cards.length === 0) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_ATTACH,
      player.deck,
      {
        superType: SuperType.ENERGY,
        provides: [CardType.PSYCHIC]
      },
      { min: 1, max: 1, allowCancel: true }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  if (cards.length > 0) {
    player.deck.moveCardsTo(cards, pokemonSlot.energies);
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Slowpoke extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Afternoon Nap',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'Search your deck for a P Energy card and attach it to Slowpoke. Shuffle your deck afterward.'
    },
    {
      name: 'Headbutt',
      cost: [CardType.PSYCHIC],
      damage: '10',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Slowpoke';

  public fullName: string = 'Slowpoke TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useAfternoonNap(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
