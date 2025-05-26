import {
  AttackEffect,
  Card,
  CardType,
  ChooseCardsPrompt,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  ShuffleDeckPrompt,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

function* useSeekOut(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
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
      {},
      { min: 0, max: 2, allowCancel: true }
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

function* useContinuousHeadbutt(
  next: Function,
  store: StoreLike,
  state: State,
  effect: AttackEffect
): IterableIterator<State> {
  const player = effect.player;

  let flipResult = false;
  let heads = 0;
  do {
    yield store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
      flipResult = result;
      heads += flipResult ? 1 : 0;
      next();
    });
  } while (flipResult);

  effect.damage = heads * 40;
  return state;
}

export class Linoone extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Zigzagoon';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 70;

  public attacks = [
    {
      name: 'Seek Out',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'Search your deck for up to 2 cards and put them into your hand. Shuffle your deck afterward.',
    },
    {
      name: 'Continuous Headbutt',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '40×',
      text: 'Flip a coin until you get tails. This attack does 40 damage times the number of heads.',
    },
  ];

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Linoone';

  public fullName: string = 'Linoone RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useSeekOut(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const generator = useContinuousHeadbutt(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
