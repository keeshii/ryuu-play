import {
  AttackEffect,
  Card,
  CardType,
  Effect,
  GameMessage,
  PokemonCard,
  ShowCardsPrompt,
  ShuffleDeckPrompt,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';


function* useLookForFriends(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (player.deck.cards.length === 0) {
    return state;
  }

  const cards: Card[] = [];
  let basicPokemon: Card | undefined;
  for (let i = 0; i < player.deck.cards.length; i++) {
    const card = player.deck.cards[i];
    cards.push(card);

    if (card instanceof PokemonCard && card.stage === Stage.BASIC) {
      basicPokemon = card;
      break;
    }
  }

  yield store.prompt(
    state,
    [
      new ShowCardsPrompt(player.id, GameMessage.CARDS_SHOWED_BY_EFFECT, cards),
      new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards),
    ],
    () => next()
  );

  if (basicPokemon !== undefined) {
    player.deck.moveCardTo(basicPokemon, player.hand);
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class NidoranFemale extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Look for Friends',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Reveal cards from your deck until you reveal a Basic Pokémon. Show that card to your opponent and put it ' +
        'into your hand. Shuffle the other revealed cards back into your deck. (If you don\'t reveal a Basic ' +
        'Pokémon, shuffle all the revealed cards back into your deck.)'
    },
    {
      name: 'Bite',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Nidoran Female';

  public fullName: string = 'Nidoran F RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useLookForFriends(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
