import {
  AddSpecialConditionsEffect,
  AttackEffect,
  Card,
  CardTag,
  CardType,
  CheckProvidedEnergyEffect,
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
} from '@ptcg/common';

export class Seviper extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Deadly Poison',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: 'You may discard a G Energy card attached to Seviper. If you do, the Defending Pokémon is now Poisoned.'
    },
    {
      name: 'Extra Poison',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: 'If the Defending Pokémon is Pokémon-ex, the Defending Pokémon is now Asleep and Poisoned.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Seviper';

  public fullName: string = 'Seviper SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      return store.prompt(
        state,
        new ChooseEnergyPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          checkProvidedEnergy.energyMap,
          [CardType.GRASS],
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

          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const defending = opponent.active.getPokemonCard();

      if (defending && defending.tags.includes(CardTag.POKEMON_EX)) {
        const specialConditionEffect = new AddSpecialConditionsEffect(effect, [
          SpecialCondition.ASLEEP,
          SpecialCondition.POISONED
        ]);
        store.reduceEffect(state, specialConditionEffect);
      }
      return state;
    }

    return state;
  }
}
