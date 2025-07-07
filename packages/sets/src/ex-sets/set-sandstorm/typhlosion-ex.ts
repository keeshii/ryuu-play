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
  StoreLike,
} from '@ptcg/common';
import { commonAttacks } from '../../common';

export class TyphlosionEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Quilava';

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 160;

  public attacks = [
    {
      name: 'Ring of Fire',
      cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40',
      text: 'The Defending Pokémon is now Burned, and can\'t retreat until the end of your opponent\'s next turn.'
    },
    {
      name: 'Split Blast',
      cost: [CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
      damage: '100',
      text:
        'Discard 1 Energy card attached to Typhlosion ex. If your opponent has more than 1 Defending Pokémon, you ' +
        'may do 50 damage to each of them instead.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING },
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Typhlosion ex';

  public fullName: string = 'Typhlosion ex SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const cantRetreat = commonAttacks.cantRetreat(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.BURNED]);
      store.reduceEffect(state, specialConditionEffect);

      cantRetreat.use(effect);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(
        state,
        new ChooseEnergyPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          checkProvidedEnergy.energyMap,
          [CardType.FIRE],
          { allowCancel: false }
        ),
        energy => {
          const cards: Card[] = (energy || []).map(e => e.card);
          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          store.reduceEffect(state, discardEnergy);
        }
      );
    }

    return state;
  }
}
