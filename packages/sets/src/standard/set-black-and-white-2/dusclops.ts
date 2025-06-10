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
} from '@ptcg/common';

function* useAstonish(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  // Opponent has no cards in the hand
  if (opponent.hand.cards.length === 0) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_DECK,
      opponent.hand,
      {},
      { min: 1, max: 1, allowCancel: false, isSecret: true }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(player.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () =>
      next()
    );
  }

  opponent.hand.moveCardsTo(cards, opponent.deck);

  return store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Dusclops extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Duskull';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 80;

  public weakness = [{ type: CardType.DARK }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Astonish',
      cost: [CardType.PSYCHIC],
      damage: '',
      text:
        'Choose a random card from your opponent\'s hand. Your opponent ' +
        'reveals that card and shuffles it into his or her deck.',
    },
    {
      name: 'Psyshot',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40',
      text: '',
    },
  ];

  public set: string = 'BW2';

  public name: string = 'Dusclops';

  public fullName: string = 'Dusclops BC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useAstonish(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
