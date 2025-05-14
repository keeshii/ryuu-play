import {
  AfterDamageEffect,
  AttackEffect,
  Card,
  CardType,
  ChooseCardsPrompt,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  HealTargetEffect,
  PlayerType,
  PokemonCard,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

function* useKnockOff(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  // Opponent has no cards in the hand
  if (opponent.hand.cards.length === 0) {
    return state;
  }

  let flipResult = false;
  yield store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
    flipResult = result;
    next();
  });

  if (!flipResult) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_DISCARD,
      opponent.hand,
      {},
      { min: 1, max: 1, allowCancel: false, isSecret: true }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  opponent.hand.moveCardsTo(cards, opponent.discard);
  return state;
}

export class Croagunk extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 60;

  public weakness = [
    {
      type: CardType.PSYCHIC,
      value: 10,
    },
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Knock Off',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'Flip a coin. If heads, choose 1 card from your opponent\'s hand without looking and discard it.',
    },
    {
      name: 'Nimble',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC],
      damage: '30',
      text:
        'If you have Turtwig in play, remove from Croagunk the number of ' +
        'damage counters equal to the damage you did to the Defending Pokémon.',
    },
  ];

  public set: string = 'OP9';

  public name: string = 'Croagunk';

  public fullName: string = 'Croagunk OP9';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useKnockOff(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AfterDamageEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      let isTurtwigInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Turtwig') {
          isTurtwigInPlay = true;
        }
      });

      if (!isTurtwigInPlay) {
        return state;
      }

      const healEffect = new HealTargetEffect(effect.attackEffect, effect.damage);
      healEffect.target = player.active;
      return store.reduceEffect(state, healEffect);
    }

    return state;
  }
}
