import {
  Card,
  CardTarget,
  CardType,
  CheckProvidedEnergyEffect,
  Effect,
  GameError,
  GameMessage,
  MoveEnergyPrompt,
  PlayerType,
  PokemonCard,
  PokemonCardList,
  PowerEffect,
  PowerType,
  SlotType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

function* useEnergyTrans(next: Function, store: StoreLike, state: State, self: Venusaur, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;
  const cardList = StateUtils.findCardList(state, self) as PokemonCardList;

  if (cardList.specialConditions.includes(SpecialCondition.ASLEEP)
    || cardList.specialConditions.includes(SpecialCondition.CONFUSED)
    || cardList.specialConditions.includes(SpecialCondition.PARALYZED)) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  const blockedMap: { source: CardTarget; blocked: number[] }[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
    const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
    store.reduceEffect(state, checkProvidedEnergy);
    const blockedCards: Card[] = [];

    checkProvidedEnergy.energyMap.forEach(em => {
      if (!em.provides.includes(CardType.GRASS) && !em.provides.includes(CardType.ANY)) {
        blockedCards.push(em.card);
      }
    });

    const blocked: number[] = [];
    blockedCards.forEach(bc => {
      const index = cardList.cards.indexOf(bc);
      if (index !== -1 && !blocked.includes(index)) {
        blocked.push(index);
      }
    });

    if (blocked.length !== 0) {
      blockedMap.push({ source: target, blocked });
    }
  });

  return store.prompt(
    state,
    new MoveEnergyPrompt(
      effect.player.id,
      GameMessage.MOVE_ENERGY_CARDS,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      { superType: SuperType.ENERGY },
      { allowCancel: true, blockedMap }
    ),
    transfers => {
      if (transfers === null) {
        return;
      }

      for (const transfer of transfers) {
        const source = StateUtils.getTarget(state, player, transfer.from);
        const target = StateUtils.getTarget(state, player, transfer.to);
        source.moveCardTo(transfer.card, target);
      }
    }
  );
}

export class Venusaur extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Ivysaur';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 100;

  public powers = [
    {
      name: 'Energy Trans',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'As often as you like during your turn (before your attack), you may take 1 Grass Energy card attached to 1 ' +
        'of your Pokémon and attach it to a different one. This power can\'t be used if Venusaur is Asleep, ' +
        'Confused, or Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Solarbeam',
      cost: [CardType.GRASS, CardType.GRASS, CardType.GRASS, CardType.GRASS],
      damage: '60',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Venusaur';

  public fullName: string = 'Venusaur BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = useEnergyTrans(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
