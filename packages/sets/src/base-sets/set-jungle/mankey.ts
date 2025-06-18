import {
  Card,
  CardList,
  CardType,
  ChooseCardsPrompt,
  Effect,
  EndTurnEffect,
  GameError,
  GameMessage,
  PlayPokemonEffect,
  PokemonCard,
  PowerEffect,
  PowerType,
  SelectPrompt,
  ShowCardsPrompt,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

function* usePeek(next: Function, store: StoreLike, state: State, self: Mankey, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const pokemonSlot = StateUtils.findPokemonSlot(state, self);

  if (!pokemonSlot
    || pokemonSlot.specialConditions.includes(SpecialCondition.ASLEEP)
    || pokemonSlot.specialConditions.includes(SpecialCondition.CONFUSED)
    || pokemonSlot.specialConditions.includes(SpecialCondition.PARALYZED)) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  const options: GameMessage[] = [];
  if (player.deck.cards.length > 0) {
    options.push(GameMessage.REVEAL_TOP_DECK_CARD);
  }

  if (opponent.deck.cards.length > 0) {
    options.push(GameMessage.REVEAL_OPPONENT_TOP_DECK_CARD);
  }

  if (opponent.hand.cards.length > 0) {
    options.push(GameMessage.REVEAL_OPPONENT_HAND_CARD);
  }

  options.push(GameMessage.REVEAL_PRIZE_CARD);
  options.push(GameMessage.REVEAL_OPPONENT_PRIZE_CARD);

  if (player.marker.hasMarker(self.PEEK_MARKER, self)) {
    throw new GameError(GameMessage.POWER_ALREADY_USED);
  }

  let choice: number | null = null;

  yield store.prompt(
    state,
    new SelectPrompt(
      player.id,
      GameMessage.CHOOSE_OPTION,
      options,
      { allowCancel: true }
    ),
    result => {
      choice = result;
      next();
    }
  );

  if (choice === null) {
    return state;
  }

  let cards: Card[] = [];

  switch (options[choice]) {
    case GameMessage.REVEAL_TOP_DECK_CARD:
      cards = player.deck.top(1);
      break;
    case GameMessage.REVEAL_OPPONENT_TOP_DECK_CARD:
      cards = opponent.deck.top(1);
      break;
    case GameMessage.REVEAL_OPPONENT_HAND_CARD:
      yield store.prompt(
        state,
        new ChooseCardsPrompt(
          player.id,
          GameMessage.REVEAL_OPPONENT_HAND_CARD,
          opponent.hand,
          {},
          { min: 1, max: 1, allowCancel: true, isSecret: true }
        ),
        selected => {
          cards = selected || [];
          next();
        }
      );
      break;
    case GameMessage.REVEAL_PRIZE_CARD: {
      const cardList = new CardList();
      player.prizes.forEach(p => { p.cards.forEach(c => cardList.cards.push(c)); });
      yield store.prompt(
        state,
        new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_PRIZE_CARD,
          cardList,
          {},
          { min: 1, max: 1, allowCancel: true, isSecret: true }
        ),
        selected => {
          cards = selected || [];
          next();
        }
      );
      break;
    }
    case GameMessage.REVEAL_OPPONENT_PRIZE_CARD: {
      const cardList = new CardList();
      opponent.prizes.forEach(p => { p.cards.forEach(c => cardList.cards.push(c)); });
      yield store.prompt(
        state,
        new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_PRIZE_CARD,
          cardList,
          {},
          { min: 1, max: 1, allowCancel: true, isSecret: true }
        ),
        selected => {
          cards = selected || [];
          next();
        }
      );
      break;
    }
  }

  if (cards.length === 0) {
    return state;
  }

  player.marker.addMarker(self.PEEK_MARKER, self);

  return store.prompt(state, new ShowCardsPrompt(
    player.id,
    GameMessage.CARDS_SHOWED_BY_EFFECT,
    cards
  ), () => { });
}

export class Mankey extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 30;

  public powers = [
    {
      name: 'Peek',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), you may look at one of the following: the top card of either ' +
        'player\'s deck, a random card from your opponent\'s hand, or one of either player\'s Prizes. This power can\'t ' +
        'be used if Mankey is Asleep, Confused, or Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Scratch',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [];

  public set: string = 'JU';

  public name: string = 'Mankey';

  public fullName: string = 'Mankey JU';

  public readonly PEEK_MARKER = 'PEEK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.PEEK_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = usePeek(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.PEEK_MARKER, this);
    }

    return state;
  }
}
