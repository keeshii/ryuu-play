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
  StoreLike,
  SuperType,
} from '@ptcg/common';


function* useFastEvolution(
  next: Function,
  store: StoreLike,
  state: State,
  effect: AttackEffect,
): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length === 0) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.deck,
      [
        { superType: SuperType.POKEMON, stage: Stage.STAGE_1 },
        { superType: SuperType.POKEMON, stage: Stage.STAGE_2 },
      ],
      { min: 0, max: 1, allowCancel: true }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  player.deck.moveCardsTo(cards, player.hand);

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Anorith extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Claw Fossil';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Fast Evolution',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Search your deck for an Evolution card, show it to your opponent, and put it into your hand. Shuffle your ' +
        'deck afterward.'
    },
    {
      name: 'Pierce',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: '30',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Anorith';

  public fullName: string = 'Anorith SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useFastEvolution(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
