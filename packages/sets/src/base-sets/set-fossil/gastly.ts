import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  ChooseCardsPrompt,
  CoinFlipPrompt,
  DealDamageEffect,
  Effect,
  GameMessage,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
  SuperType,
} from '@ptcg/common';

export class Gastly extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Lick',
      cost: [CardType.PSYCHIC],
      damage: '10',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
    {
      name: 'Energy Conversion',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC],
      damage: '',
      text: 'Put up to 2 Energy cards from your discard pile into your hand. Gastly does 10 damage to itself.'
    },
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [];

  public set: string = 'FO';

  public name: string = 'Gastly';

  public fullName: string = 'Gastly FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const energyCount = player.discard.cards.filter(c => c.superType === SuperType.ENERGY).length;

      if (energyCount === 0) {
        return state;
      }

      const max = Math.min(2, energyCount);

      return store.prompt(
        state,
        [
          new ChooseCardsPrompt(
            player.id,
            GameMessage.CHOOSE_CARD_TO_HAND,
            player.discard,
            { superType: SuperType.ENERGY },
            { min: 0, max, allowCancel: false }
          ),
        ],
        selected => {
          const cards = selected || [];
          player.discard.moveCardsTo(cards, player.hand);

          const dealDamage = new DealDamageEffect(effect, 10);
          dealDamage.target = player.active;
          store.reduceEffect(state, dealDamage);
        }
      );
    }

    return state;
  }
}
