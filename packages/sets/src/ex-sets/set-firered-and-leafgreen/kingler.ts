import {
  AttackEffect,
  Card,
  CardType,
  CheckAttackCostEffect,
  CheckProvidedEnergyEffect,
  ChooseCardsPrompt,
  Effect,
  EnergyType,
  GameMessage,
  PokemonCard,
  ShuffleDeckPrompt,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

function* useSaltWater(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length === 0) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_ATTACH,
      player.deck,
      {
        superType: SuperType.ENERGY,
        energyType: EnergyType.BASIC,
        name: 'Water Energy',
      },
      { min: 0, max: 2, allowCancel: true }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  player.deck.moveCardsTo(cards, player.active.energies);

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Kingler extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Krabby';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Salt Water',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'Search your deck for up to 2 W Energy cards and attach them to Kingler. Shuffle your deck afterward.'
    },
    {
      name: 'Hyper Pump',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: '30+',
      text:
        'Does 30 damage plus 20 more damage for each basic Energy attached to Kingler but not used to pay for this ' +
        'attack\'s Energy cost. You can\'t add more than 40 damage in this way.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Kingler';

  public fullName: string = 'Kingler RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useSaltWater(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkAttackCost = new CheckAttackCostEffect(player, effect.attack);
      state = store.reduceEffect(state, checkAttackCost);
      const attackCost = checkAttackCost.cost;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);
      let provided = checkProvidedEnergyEffect.energyMap;
      const basics = provided.filter(p => p.card.energyType === EnergyType.BASIC);

      let additionalBasicEnergies = 0;
      for (const basic of basics) {
        const providedTemp = provided.filter(p => p !== basic);
        if (StateUtils.checkEnoughEnergy(providedTemp, attackCost)) {
          provided = providedTemp;
          additionalBasicEnergies += 1;
        }
      }

      effect.damage += Math.min(additionalBasicEnergies, 2) * 20;
    }

    return state;
  }
}
