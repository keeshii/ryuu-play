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
  SuperType,
} from '@ptcg/common';

function* useAscension(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length === 0) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_EVOLVE,
      player.deck,
      {
        superType: SuperType.POKEMON,
        stage: Stage.STAGE_1,
        evolvesFrom: 'Magikarp',
      },
      { min: 1, max: 1, allowCancel: true }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  if (cards.length > 0) {
    // Evolve Pokemon
    player.deck.moveCardsTo(cards, player.active.pokemons);
    player.active.clearEffects();
    player.active.pokemonPlayedTurn = state.turn;
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Magikarp extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 30;

  public attacks = [
    {
      name: 'Surprise Attack',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: 'Flip a coin. If tails, this attack does nothing.'
    },
    {
      name: 'Ascension',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: '',
      text:
        'Search your deck for a card that evolves from Magikarp and put it on Magikarp. (This counts as evolving ' +
        'Magikarp.) Shuffle your deck afterward.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Magikarp';

  public fullName: string = 'Magikarp RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
        if (result === false) {
          effect.damage = 0;
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const generator = useAscension(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
