import {
  AttackEffect,
  Card,
  CardType,
  ChooseCardsPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  ShowCardsPrompt,
  ShuffleDeckPrompt,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

function* useFastEvolution(
  next: Function,
  store: StoreLike,
  state: State,
  effect: AttackEffect
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] | null = [];

  if (player.deck.cards.length === 0) {
    return state;
  }

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.deck,
      [
        { superType: SuperType.POKEMON, stage: Stage.STAGE_1 },
        { superType: SuperType.POKEMON, stage: Stage.STAGE_2 }
      ],
      { min: 0, max: 2, allowCancel: false }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  player.deck.moveCardsTo(cards, player.hand);

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () =>
      next()
    );
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Nidorina extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Nidoran Female';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Scratch',
      cost: [CardType.COLORLESS],
      damage: '20',
      text: ''
    },
    {
      name: 'Fast Evolution',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'Search your deck for up to 2 Evolution cards, show them to your opponent, and put them into your hand. ' +
        'Shuffle your deck afterward.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Nidorina';

  public fullName: string = 'Nidorina RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const generator = useFastEvolution(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
