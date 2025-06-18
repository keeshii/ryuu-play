import {
  AddSpecialConditionsEffect,
  AttackEffect,
  Card,
  CardType,
  ChooseCardsPrompt,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  PokemonSlot,
  ShuffleDeckPrompt,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
  SuperType,
} from '@ptcg/common';

function* useSprout(
  next: Function,
  store: StoreLike,
  state: State,
  effect: AttackEffect
): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonSlot[] = player.bench.filter(b => b.pokemons.cards.length === 0);
  const max = Math.min(slots.length, 1);

  if (player.deck.cards.length === 0) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
      player.deck,
      { superType: SuperType.POKEMON, stage: Stage.BASIC, name: 'Oddish' },
      { min: 0, max, allowCancel: true }
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

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Oddish extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Stun Spore',
      cost: [CardType.GRASS],
      damage: '10',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
    {
      name: 'Sprout',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: '',
      text:
        'Search your deck for a Basic Pokémon named Oddish and put it onto your Bench. Shuffle your deck afterward. ' +
        '(You can\'t use this attack if your Bench is full.)'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Oddish';

  public fullName: string = 'Oddish JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const generator = useSprout(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
