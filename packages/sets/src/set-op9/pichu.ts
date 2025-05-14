import {
  AttackEffect,
  Card,
  CardType,
  ChooseCardsPrompt,
  CoinFlipPrompt,
  Effect,
  EvolveEffect,
  GameError,
  GameMessage,
  PokemonCard,
  PokemonCardList,
  PowerEffect,
  PowerType,
  ShowCardsPrompt,
  ShuffleDeckPrompt,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

function* useBabyEvolution(
  next: Function,
  store: StoreLike,
  state: State,
  self: Pichu,
  effect: PowerEffect
): IterableIterator<State> {
  const player = effect.player;
  const cardList = StateUtils.findCardList(state, self);
  if (!(cardList instanceof PokemonCardList)) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }
  const hasPikachu = player.hand.cards.some(c => c.name === 'Pikachu');
  if (!hasPikachu) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  let cards: Card[] = [];
  return store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_EVOLVE,
      player.hand,
      { superType: SuperType.POKEMON, name: 'Pikachu' },
      { min: 1, max: 1, allowCancel: true }
    ),
    selected => {
      cards = selected || [];

      if (cards.length > 0) {
        const pokemonCard = cards[0] as PokemonCard;
        const evolveEffect = new EvolveEffect(player, cardList, pokemonCard);
        store.reduceEffect(state, evolveEffect);

        cardList.damage = 0;
      }
    }
  );
}

function* useFindAFriend(
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

  let coinResult: boolean = false;
  yield store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
    coinResult = result;
    next();
  });

  if (coinResult === false) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.deck,
      { superType: SuperType.POKEMON },
      { allowCancel: true, min: 1, max: 1 }
    ),
    selected => {
      cards = selected || [];
      next();
    }
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

export class Pichu extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 40;

  public weakness = [{ type: CardType.FIGHTING, value: 10 }];

  public resistance = [{ type: CardType.METAL, value: -20 }];

  public retreat = [CardType.COLORLESS];

  public powers = [
    {
      name: 'Baby Evolution',
      useWhenInPlay: true,
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), you may put Pikachu ' +
        'from your hand onto Pichu (this counts as evolving Pichu) and remove ' +
        'all damage counters from Pichu.',
    },
  ];

  public attacks = [
    {
      name: 'Find a Friend',
      cost: [],
      damage: '',
      text:
        'Flip a coin. If heads, search your deck for a Pokémon, ' +
        'show it to your opponent, and put it into your hand. ' +
        'Shuffle your deck afterward.',
    },
  ];

  public set: string = 'OP9';

  public name: string = 'Pichu';

  public fullName: string = 'Pichu OP9';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = useBabyEvolution(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useFindAFriend(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
