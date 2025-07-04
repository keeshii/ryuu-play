import {
  AttackEffect,
  Card,
  CardType,
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

function* useJumpCatch(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.deck,
      { superType: SuperType.TRAINER },
      { min: 1, max: 1, allowCancel: true }
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

export class Azurill extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 40;

  public powers = [
    {
      name: 'Baby Evolution',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), you may put Marill from your hand onto Azurill (this counts as ' +
        'evolving Azurill), and remove all damage counters from Azurill.'
    },
  ];

  public attacks = [
    {
      name: 'Jump Catch',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Search your deck for a Trainer card, show it to your opponent, and put it into your hand. Shuffle your ' +
        'deck afterward.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Azurill';

  public fullName: string = 'Azurill SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);

      if (!pokemonSlot) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const hasMarril = player.hand.cards.some(c => c.name === 'Marill');
      if (!hasMarril) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_EVOLVE,
          player.hand,
          { superType: SuperType.POKEMON, name: 'Marill' },
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
      const generator = useJumpCatch(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
