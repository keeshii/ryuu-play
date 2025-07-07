import {
  AttackEffect,
  Card,
  CardType,
  CheckProvidedEnergyEffect,
  ChooseCardsPrompt,
  Effect,
  EvolveEffect,
  GameError,
  GameMessage,
  PokemonCard,
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

function* useAlluringSmile(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (player.deck.cards.length === 0) {
    return state;
  }

  const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
  state = store.reduceEffect(state, checkProvidedEnergy);
  const max = checkProvidedEnergy.energyMap.reduce((left, p) => left + p.provides.length, 0);

  if (max === 0) {
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
      { min: 0, max, allowCancel: true }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  player.deck.moveCardsTo(cards, player.hand);

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () =>
      next()
    );
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Wynaut extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 50;

  public powers = [
    {
      name: 'Baby Evolution',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'Once during your turn (before your attack), you may put Wobbuffet from your hand onto Wynaut (this counts ' +
        'as evolving Wynaut), and remove all damage counters from Wynaut.'
    },
  ];

  public attacks = [
    {
      name: 'Alluring Smile',
      cost: [CardType.PSYCHIC],
      damage: '',
      text:
        'Search your deck for a Basic Pokémon card or Evolution card for each Energy attached to Wynaut, show them ' +
        'to your opponent, and put them into your hand. Shuffle your deck afterward.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Wynaut';

  public fullName: string = 'Wynaut SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);

      if (!pokemonSlot) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const hasMarril = player.hand.cards.some(c => c.name === 'Wobbuffet');
      if (!hasMarril) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_EVOLVE,
          player.hand,
          { superType: SuperType.POKEMON, name: 'Wobbuffet' },
          { min: 1, max: 1, allowCancel: true }
        ),
        selected => {
          const cards = selected || [];

          if (cards.length > 0) {
            const pokemonCard = cards[0] as PokemonCard;
            const evolveEffect = new EvolveEffect(player, pokemonSlot, pokemonCard);
            store.reduceEffect(state, evolveEffect);

            pokemonSlot.damage = 0;
          }
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useAlluringSmile(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
