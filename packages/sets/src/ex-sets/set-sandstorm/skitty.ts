import {
  AttackEffect,
  CardType,
  ChooseCardsPrompt,
  DealDamageEffect,
  Effect,
  EnergyCard,
  EnergyType,
  GameMessage,
  PokemonCard,
  Stage,
  State,
  StoreLike,
  SuperType,
} from '@ptcg/common';

export class Skitty extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Energy Catch',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'Search your discard pile for a basic Energy card, show it to your opponent, and put it into your hand.'
    },
    {
      name: 'Double-edge',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text: 'Skitty does 10 damage to itself.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Skitty';

  public fullName: string = 'Skitty SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard && c.energyType === EnergyType.BASIC;
      });

      if (!hasEnergyInDiscard) {
        return state;
      }

      return store.prompt(
        state,
        [
          new ChooseCardsPrompt(
            player.id,
            GameMessage.CHOOSE_CARD_TO_HAND,
            player.discard,
            { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
            { min: 1, max: 1, allowCancel: false }
          ),
        ],
        selected => {
          const cards = selected || [];
          player.discard.moveCardsTo(cards, player.hand);
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 10);
      dealDamage.target = player.active;
      store.reduceEffect(state, dealDamage);
    }

    return state;
  }
}
