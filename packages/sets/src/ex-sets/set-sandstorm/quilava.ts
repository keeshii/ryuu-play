import {
  AddSpecialConditionsEffect,
  AttackEffect,
  Card,
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
  StoreLike,
} from '@ptcg/common';

export class Quilava extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Cyndaquil';

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Slash',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: ''
    },
    {
      name: 'Burning Claw',
      cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40',
      text: 'You may discard a R Energy card attached to Quilava. If you do, the Defending Pokémon is now Burned.'
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Quilava';

  public fullName: string = 'Quilava SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
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
          [CardType.FIRE],
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
          
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.BURNED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      );
    }

    return state;
  }
}
