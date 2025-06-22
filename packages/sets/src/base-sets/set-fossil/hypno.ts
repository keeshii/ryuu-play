import {
  AttackEffect,
  CardList,
  CardType,
  ChoosePokemonPrompt,
  Effect,
  GameMessage,
  OrderCardsPrompt,
  PlayerType,
  PokemonCard,
  PutDamageEffect,
  SelectPrompt,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

function* useProphecy(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const options: GameMessage[] = [];

  if (player.deck.cards.length > 0) {
    options.push(GameMessage.REVEAL_TOP_DECK_CARD);
  }

  if (opponent.deck.cards.length > 0) {
    options.push(GameMessage.REVEAL_OPPONENT_TOP_DECK_CARD);
  }

  if (options.length === 0) {
    return state;
  }

  let option: GameMessage = options[0];
  if (options.length === 2)
    yield store.prompt(
      state,
      new SelectPrompt(
        player.id,
        GameMessage.CHOOSE_OPTION,
        options,
        { allowCancel: false }
      ),
      choice => {
        option = options[choice];
        next();
      }
    );

  let cardList: CardList = player.deck;
  if (option === GameMessage.REVEAL_OPPONENT_TOP_DECK_CARD) {
    cardList = opponent.deck;
  }

  // Get up to 3 cards from the top of the deck
  const deckTop = new CardList();
  cardList.moveTo(deckTop, 3);

  return store.prompt(state, new OrderCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARDS_ORDER,
    deckTop,
    { allowCancel: false }
  ), order => {
    if (order !== null) {
      deckTop.applyOrder(order);
    }
    cardList.cards.unshift(...deckTop.cards);
  });
}

export class Hypno extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Drowzee';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 90;

  public attacks = [
    {
      name: 'Prophecy',
      cost: [CardType.PSYCHIC],
      damage: '',
      text: 'Look at up to 3 cards from the top of either player\'s deck and rearrange them as you like.'
    },
    {
      name: 'Dark Mind',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.PSYCHIC],
      damage: '30',
      text:
        'If your opponent has any Benched Pokémon, choose 1 of them and this attack does 10 damage to it. (Don\'t ' +
        'apply Weakness and Resistance for Benched Pokémon.)'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Hypno';

  public fullName: string = 'Hypno FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useProphecy(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.pokemons.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ),
        targets => {
          if (!targets || targets.length === 0) {
            return;
          }
          const damageEffect = new PutDamageEffect(effect, 10);
          damageEffect.target = targets[0];
          store.reduceEffect(state, damageEffect);
        }
      );
    }

    return state;
  }
}
