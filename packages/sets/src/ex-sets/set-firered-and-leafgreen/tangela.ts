import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardList,
  CardType,
  ChooseCardsPrompt,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';


export class Tangela extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Vine Tease',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Look at your Prize cards without showing your opponent. Choose 1 of the Prize cards and switch it with the ' +
        'top card of your deck without looking at the top card of your deck. If you have no cards in your deck, ' +
        'this attack does nothing.'
    },
    {
      name: 'Wiggle',
      cost: [CardType.GRASS],
      damage: '',
      text:
        'Flip a coin. If heads, the Defending Pokémon is now Confused. If tails, the Defending Pokémon is now ' +
        'Poisoned.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public resistance = [
    { type: CardType.WATER, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Tangela';

  public fullName: string = 'Tangela RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      const prizes = new CardList();
      player.prizes.forEach(p => {
        p.cards.forEach(c => prizes.cards.push(c));
      });

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TO_DECK,
          prizes,
          { },
          { min: 1, max: 1, allowCancel: false }
        ),
        selected => {
          const cards = selected || [];
          if (cards.length > 0) {
            const cardList = StateUtils.findCardList(state, cards[0]);
            const temp = player.deck.cards[0];
            player.deck.cards[0] = cardList.cards[0];
            cardList.cards[0] = temp;
          }
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
          store.reduceEffect(state, specialConditionEffect);
        } else {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    return state;
  }
}
