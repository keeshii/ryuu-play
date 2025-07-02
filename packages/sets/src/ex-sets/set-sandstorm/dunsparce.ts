import {
  AttackEffect,
  Card,
  CardType,
  ChooseCardsPrompt,
  ChoosePokemonPrompt,
  Effect,
  GameMessage,
  PlayerType,
  PokemonCard,
  PokemonSlot,
  ShuffleDeckPrompt,
  SlotType,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
  SuperType,
} from '@ptcg/common';

import { commonAttacks } from '../../common';


function* useStrikeAndRun(
  next: Function,
  store: StoreLike,
  state: State,
  effect: AttackEffect,
): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonSlot[] = player.bench.filter(b => b.pokemons.cards.length === 0);
  const max = Math.min(slots.length, 3);

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

  yield store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
    next();
  });

  const hasBenched = player.bench.some(b => b.pokemons.cards.length > 0);
  if (!hasBenched) {
    return state;
  }

  return store.prompt(
    state,
    new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.BENCH],
      { allowCancel: true }
    ),
    selected => {
      if (!selected || selected.length === 0) {
        return state;
      }
      const target = selected[0];
      player.switchPokemon(target);
    }
  );
}

export class Dunsparce extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Strike and Run',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Search your deck for up to 3 Basic Pokémon and put them onto your Bench. Shuffle your deck afterward. You ' +
        'may switch Dunsparce with 1 of your Benched Pokémon.'
    },
    {
      name: 'Sudden Flash',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: 'Flip a coin. If heads, each Defending Pokémon is now Paralyzed.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Dunsparce';

  public fullName: string = 'Dunsparce SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const flipSpecialConditions = commonAttacks.flipSpecialConditions(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useStrikeAndRun(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return flipSpecialConditions.use(effect, [SpecialCondition.PARALYZED]);
    }

    return state;
  }
}
