import {
  AttackEffect,
  Card,
  CardType,
  ChooseCardsPrompt,
  Effect,
  GameMessage,
  GamePhase,
  PokemonCard,
  PokemonSlot,
  PowerEffect,
  PowerType,
  PutDamageEffect,
  ShuffleDeckPrompt,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

function* useTeamAssembly(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;

  // Player
  const slots: PokemonSlot[] = player.bench.filter(b => b.pokemons.cards.length === 0);
  const max = slots.length;

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
      player.deck,
      [
        { superType: SuperType.POKEMON, stage: Stage.BASIC },
        { superType: SuperType.POKEMON, name: 'Omanyte' },
        { superType: SuperType.POKEMON, name: 'Kabuto' }
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

export class Kabuto extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Mysterious Fossil';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 60;

  public powers = [
    {
      name: 'Exoskeleton',
      powerType: PowerType.POKEBODY,
      text: 'Any damage done to Kabuto by attacks is reduced by 20 (after applying Weakness and Resistance).'
    },
  ];

  public attacks = [
    {
      name: 'Team Assembly',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Search your deck for Omanyte, Kabuto, or any Basic Pokémon and put as many of them as you like onto your ' +
        'Bench. Shuffle your deck afterward. Treat the new Benched Pokémon as Basic Pokémon.'
    },
    {
      name: 'Pierce',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: '20',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Kabuto';

  public fullName: string = 'Kabuto SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Reduce damage by 20
    if (effect instanceof PutDamageEffect && effect.target.pokemons.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();

      // It's not this pokemon card
      if (pokemonCard !== this) {
        return state;
      }

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      const player = StateUtils.findOwner(state, effect.target);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      effect.damage = Math.max(0, effect.damage - 20);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useTeamAssembly(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
