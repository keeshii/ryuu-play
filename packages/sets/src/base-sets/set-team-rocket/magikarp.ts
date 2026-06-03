import {
  AttackEffect,
  Card,
  CardType,
  ChooseCardsPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  ShuffleDeckPrompt,
  Stage,
  State,
  StoreLike,
  SuperType
} from '@ptcg/common';

function* useRapidEvolution(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
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
      [{
        superType: SuperType.POKEMON,
        stage: Stage.STAGE_1,
        evolvesFrom: 'Magikarp',
        name: 'Gyarados',
      }, {
        superType: SuperType.POKEMON,
        stage: Stage.STAGE_1,
        evolvesFrom: 'Magikarp',
        name: 'Dark Gyarados',
      }],
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
      name: 'Flop',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: ''
    },
    {
      name: 'Rapid Evolution',
      cost: [CardType.WATER, CardType.WATER, CardType.WATER],
      damage: '',
      text:
        'Search your deck for an Evolution card named Gyarados or Dark Gyarados and put it on Magikarp. (This ' +
        'counts as evolving Magikarp.) Shuffle your deck afterward.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Magikarp';

  public fullName: string = 'Magikarp TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const generator = useRapidEvolution(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
