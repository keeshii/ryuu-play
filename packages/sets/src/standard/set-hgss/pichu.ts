import {
  AddSpecialConditionsEffect,
  AttackEffect,
  Card,
  CardType,
  ChooseCardsPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  PokemonSlot,
  PowerEffect,
  PowerType,
  PutDamageEffect,
  ShuffleDeckPrompt,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

function* usePlayground(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
  specialCondition.target = player.active;
  store.reduceEffect(state, specialCondition);

  // Player
  let slots: PokemonSlot[] = player.bench.filter(b => b.pokemons.cards.length === 0);
  let max = slots.length;

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
      player.deck,
      { superType: SuperType.POKEMON, stage: Stage.BASIC },
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

  // Opponent
  slots = opponent.bench.filter(b => b.pokemons.cards.length === 0);
  max = slots.length;

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      opponent.id,
      GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
      opponent.deck,
      { superType: SuperType.POKEMON, stage: Stage.BASIC },
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
    opponent.deck.moveCardTo(card, slots[index].pokemons);
    slots[index].pokemonPlayedTurn = state.turn;
  });

  // Shuffle decks
  store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });

  store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
    opponent.deck.applyOrder(order);
  });

  return state;
}

export class Pichu extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 30;

  public retreat = [];

  public powers = [
    {
      name: 'Sweet Sleeping Face',
      powerType: PowerType.POKEBODY,
      text: 'As long as Pichu is Asleep, prevent all damage done to Cleffa by attacks.',
    },
  ];

  public attacks = [
    {
      name: 'Playground',
      cost: [],
      damage: '',
      text:
        'Each player may search his or her deck for as many Basic ' +
        'Pokémon as he or she likes, put them onto his or her Bench, and ' +
        'shuffle his or her deck afterward. (You put your Pokémon on the ' +
        'Bench first.) Pichu is now Asleep.',
    },
  ];

  public set: string = 'HGSS';

  public name: string = 'Pichu';

  public fullName: string = 'Pichu HGSS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Playground
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = usePlayground(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    // Sweet Sleeping Face
    if (effect instanceof PutDamageEffect) {
      if (effect.target.pokemons.cards.includes(this)) {
        const pokemonCard = effect.target.getPokemonCard();
        const isAsleep = effect.target.specialConditions.includes(SpecialCondition.ASLEEP);
        if (pokemonCard === this && isAsleep) {
          // Try to reduce PowerEffect, to check if something is blocking our ability
          try {
            const powerEffect = new PowerEffect(effect.player, this.powers[0], this);
            store.reduceEffect(state, powerEffect);
          } catch {
            return state;
          }
          effect.preventDefault = true;
        }
      }
    }

    return state;
  }
}
