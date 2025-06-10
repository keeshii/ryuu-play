import {
  AddSpecialConditionsEffect,
  AttackEffect,
  Card,
  CardType,
  ChooseCardsPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  ShowCardsPrompt,
  ShuffleDeckPrompt,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

function* useSignsOfEvolution(
  next: Function,
  store: StoreLike,
  state: State,
  effect: AttackEffect
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (player.deck.cards.length === 0) {
    return state;
  }

  const blocked: number[] = [];
  player.deck.cards.forEach((card, index) => {
    if (!['Silcoon', 'Beautifly', 'Cascoon', 'Dustox'].includes(card.name)) {
      blocked.push(index);
    }
  });

  let cards: Card[] = [];
  do {
    yield store.prompt(
      state,
      new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.POKEMON },
        { allowCancel: true, min: 1, max: 2, blocked }
      ),
      selected => {
        cards = selected || [];
        next();
      }
    );

    // Sort cards alphabetically by its name
    cards.sort((c1, c2) => (c1.name === c2.name ? 0 : c1.name < c2.name ? -1 : 1));
  } while (cards.length === 2
    && (cards[0].name !== 'Beautifly' || cards[1].name !== 'Silcoon')
    && (cards[0].name !== 'Cascoon' || cards[1].name !== 'Dustox')
  );

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () =>
      next()
    );
  }

  player.deck.moveCardsTo(cards, player.hand);

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Wurmple extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Signs of Evolution',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Search your deck for Silcoon and Beautifly, or Cascoon and Dustox cards. Show 1 card or both cards of a ' +
        'pair to your opponent and put them into your hand. Shuffle your deck afterward.',
    },
    {
      name: 'Poison Barb',
      cost: [CardType.GRASS],
      damage: '',
      text: 'The Defending Pokémon is now Poisoned.',
    },
  ];

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Wurmple';

  public fullName: string = 'Wurmple RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useSignsOfEvolution(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}
