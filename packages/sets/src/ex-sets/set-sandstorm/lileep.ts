import {
  AttackEffect,
  Card,
  CardTarget,
  CardType,
  ChooseCardsPrompt,
  ChoosePokemonPrompt,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  MoveCardsEffect,
  PlayerType,
  PokemonCard,
  PokemonSlot,
  ShuffleDeckPrompt,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

function* useInfluence(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;

  // Player
  const slots: PokemonSlot[] = player.bench.filter(b => b.pokemons.cards.length === 0);
  const max = Math.min(slots.length, 2);

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
      player.deck,
      [
        { superType: SuperType.POKEMON, name: 'Omanyte' },
        { superType: SuperType.POKEMON, name: 'Kabuto' },
        { superType: SuperType.POKEMON, name: 'Aerodactyl' },
        { superType: SuperType.POKEMON, name: 'Lileep' },
        { superType: SuperType.POKEMON, name: 'Anorith' }
      ],
      { min: 0, max, allowCancel: false }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  if (cards.length > slots.length) {
    cards.length = slots.length;
  }

  cards.forEach((card, index) => {
    player.deck.moveCardTo(card, slots[index].pokemons);
    slots[index].pokemonPlayedTurn = state.turn;
  });

  // Shuffle deck
  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

function* useTimeSpiral(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  let hasEvolved = false;
  const blocked: CardTarget[] = [];
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (pokemonSlot, pokemonCard, cardTarget) => {
    if (pokemonSlot.pokemons.cards.length > 1) {
      hasEvolved = true;
    } else {
      blocked.push(cardTarget);
    }
  });

  if (!hasEvolved) {
    return state;
  }

  let flipResult = false;
  yield store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
    flipResult = result;
    next();
  });

  if (!flipResult) {
    return state;
  }

  let targets: PokemonSlot[] = [];
  yield store.prompt(
    state,
    new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
      PlayerType.TOP_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      { allowCancel: false, blocked }
    ),
    results => {
      targets = results || [];
      next();
    }
  );

  for (const target of targets) {
    const pokemonCard = target.getPokemonCard();
    if (pokemonCard !== undefined) {
      const moveCardsEffect = new MoveCardsEffect(effect, [pokemonCard], opponent.deck);
      moveCardsEffect.target = target;
      store.reduceEffect(state, moveCardsEffect);
    }
  }

  return store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
    opponent.deck.applyOrder(order);
  });
}

export class Lileep extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Root Fossil';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Influence',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Search your deck for Omanyte, Kabuto, Aerodactyl, Lileep, or Anorith and put up to 2 of them onto your ' +
        'Bench. Shuffle your deck afterward. Treat the new Benched Pokémon as Basic Pokémon.'
    },
    {
      name: 'Time Spiral',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'If your opponent has any Evolved Pokémon in play, choose 1 of them and flip a coin. If heads, remove the ' +
        'highest Stage Evolution card on that Pokémon and have your opponent shuffle it into his or her deck.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Lileep';

  public fullName: string = 'Lileep SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useInfluence(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const generator = useTimeSpiral(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
