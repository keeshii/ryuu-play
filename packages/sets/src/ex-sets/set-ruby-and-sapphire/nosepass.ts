import {
  AttackEffect,
  Card,
  CardType,
  ChooseCardsPrompt,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  MoveCardsEffect,
  PokemonCard,
  ShuffleDeckPrompt,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

function* useInvisibleHand(
  next: Function,
  store: StoreLike,
  state: State,
  effect: AttackEffect
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (player.deck.cards.length === 0 || !opponent.active.isEvolved()) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.deck,
      {},
      { min: 1, max: 1, allowCancel: false }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  player.deck.moveCardsTo(cards, player.hand);

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Nosepass extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Invisible Hand',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'If any of your opponent\'s Active Pokémon are Evolved Pokémon, search your deck for any 1 card and put it ' +
        'into your hand. Shuffle your deck afterward.',
    },
    {
      name: 'Repulsion',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'Flip a coin. If heads, your opponent returns the Defending Pokémon and all cards attached to it to his or ' +
        'her hand. (If your opponent doesn\'t have any Benched Pokémon or other Active Pokémon, this attack does ' +
        'nothing.)',
    },
  ];

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Nosepass';

  public fullName: string = 'Nosepass RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useInvisibleHand(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.pokemons.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result) {
          const defendingCards = [
            ...opponent.active.pokemons.cards,
            ...opponent.active.energies.cards,
            ...opponent.active.trainers.cards,
          ];
          const moveCardsEffect = new MoveCardsEffect(effect, defendingCards, opponent.hand);
          store.reduceEffect(state, moveCardsEffect);
          if (!moveCardsEffect.preventDefault) {
            opponent.active.clearEffects();
          }
        }
      });
    }

    return state;
  }
}
