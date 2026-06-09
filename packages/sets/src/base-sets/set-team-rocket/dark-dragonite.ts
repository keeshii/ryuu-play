import {
  AttackEffect,
  Card,
  CardType,
  ChooseCardsPrompt,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PlayPokemonEffect,
  PokemonCard,
  PokemonSlot,
  PowerEffect,
  PowerType,
  ShuffleDeckPrompt,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

function* useSummonMinions(next: Function, store: StoreLike, state: State, effect: PlayPokemonEffect): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonSlot[] = player.bench.filter(b => b.pokemons.cards.length === 0);
  const max = Math.min(slots.length, 2);

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

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class DarkDragonite extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Dark Dragonair';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 70;

  public powers = [
    {
      name: 'Summon Minions',
      powerType: PowerType.POKEPOWER,
      text:
        'When you play Dark Dragonite from your hand, search your deck for up to 2 Basic Pokémon and put them onto ' +
        'your Bench. Shuffle your deck afterward.'
    },
  ];

  public attacks = [
    {
      name: 'Giant Tail',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '70',
      text: 'Flip a coin. If tails, this attack does nothing.'
    },
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Dragonite';

  public fullName: string = 'Dark Dragonite TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const player = StateUtils.findOwner(state, effect.target);
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      const generator = useSummonMinions(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
        if (result === false) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }
}
