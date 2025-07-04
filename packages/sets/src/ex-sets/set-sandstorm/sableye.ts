import {
  AddSpecialConditionsEffect,
  AttackEffect,
  Card,
  CardType,
  CheckProvidedEnergyEffect,
  ChooseCardsPrompt,
  ChooseEnergyPrompt,
  DiscardCardsEffect,
  Effect,
  GameMessage,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

export class Sableye extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.DARK];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Supernatural',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Look at your opponent\'s hand. You may use the effect of a Supporter card you find there as the effect of ' +
        'this attack. (The Supporter card remains in your opponent\'s hand.)'
    },
    {
      name: 'Dark Bind',
      cost: [CardType.DARK, CardType.COLORLESS],
      damage: '20',
      text: 'You may discard a D Energy card attached to Sableye. If you do, the Defending Pokémon is now Paralyzed.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Sableye';

  public fullName: string = 'Sableye SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TO_COPY_EFFECT,
          opponent.hand,
          { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
          { allowCancel: true, min: 1, max: 1 }
        ),
        cards => {
          if (cards === null || cards.length === 0) {
            return;
          }
          const trainerCard = cards[0] as TrainerCard;
          const playTrainerEffect = new TrainerEffect(player, trainerCard);
          store.reduceEffect(state, playTrainerEffect);
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      return store.prompt(
        state,
        new ChooseEnergyPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          checkProvidedEnergy.energyMap,
          [CardType.DARK],
          { allowCancel: true }
        ),
        energy => {
          const cards: Card[] = (energy || []).map(e => e.card);
          if (cards.length === 0) {
            return;
          }
          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          store.reduceEffect(state, discardEnergy);
          
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      );
    }

    return state;
  }
}
