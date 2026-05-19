import {
  AddSpecialConditionsEffect,
  AttachEnergyPrompt,
  AttackEffect,
  CardTag,
  CardTarget,
  CardType,
  Effect,
  EnergyType,
  GameMessage,
  PlayerType,
  PokemonCard,
  ShuffleDeckPrompt,
  SlotType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

function* useEnergyPowder(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;

  const blockedTo: CardTarget[] = [];
  let hasAnyOtherPokemon = false;
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (slot, card, target) => {
    if (card.tags.includes(CardTag.POKEMON_EX)) {
      blockedTo.push(target);
    } else {
      hasAnyOtherPokemon = true;
    }
  });

  if (!hasAnyOtherPokemon) {
    return state;
  }

  yield store.prompt(
    state,
    new AttachEnergyPrompt(
      player.id,
      GameMessage.ATTACH_ENERGY_CARDS,
      player.deck,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      {
        superType: SuperType.ENERGY,
        energyType: EnergyType.BASIC
      },
      { allowCancel: true, min: 1, max: 2, blockedTo }
    ),
    transfers => {
      transfers = transfers || [];
      // cancelled by user
      if (transfers.length === 0) {
        return;
      }
      for (const transfer of transfers) {
        const target = StateUtils.getTarget(state, player, transfer.to);
        player.deck.moveCardTo(transfer.card, target.energies);
      }
      next();
    }
  );

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Parasect extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Paras';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Energy Powder',
      cost: [CardType.GRASS],
      damage: '',
      text:
        'Search your deck for up to 2 basic Energy cards and attach them to any of your Pokémon (excluding ' +
        'Pokémon-ex) in any way you like. Shuffle your deck afterward.'
    },
    {
      name: 'Toxic Spore',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: '20',
      text: 'The Defending Pokémon is now Poisoned.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Parasect';

  public fullName: string = 'Parasect RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useEnergyPowder(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}
