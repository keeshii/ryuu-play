import {
  AttackEffect,
  Card,
  CardTarget,
  CardType,
  CheckProvidedEnergyEffect,
  CoinFlipPrompt,
  Effect,
  EnergyCard,
  GameError,
  GameMessage,
  MoveEnergyPrompt,
  PlayerType,
  PokemonCard,
  PowerEffect,
  PowerType,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

function* useEnergyTrans(next: Function, store: StoreLike, state: State, self: Sceptile2, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;
  const pokemonSlot = StateUtils.findPokemonSlot(state, self);

  if (!pokemonSlot || pokemonSlot.specialConditions.length > 0) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  const blockedMap: { source: CardTarget; blocked: number[] }[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (slot, card, target) => {
    const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, slot);
    store.reduceEffect(state, checkProvidedEnergy);
    const blockedCards: Card[] = [];

    checkProvidedEnergy.energyMap.forEach(em => {
      if (!em.provides.includes(CardType.GRASS) && !em.provides.includes(CardType.ANY)) {
        blockedCards.push(em.card);
      }
    });

    const blocked: number[] = [];
    blockedCards.forEach(bc => {
      const index = slot.energies.cards.indexOf(bc as EnergyCard);
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
      { },
      { allowCancel: true, blockedMap }
    ),
    transfers => {
      if (transfers === null) {
        return;
      }

      for (const transfer of transfers) {
        const source = StateUtils.getTarget(state, player, transfer.from);
        const target = StateUtils.getTarget(state, player, transfer.to);
        source.moveCardTo(transfer.card, target.energies);
      }
    }
  );
}

export class Sceptile2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Grovyle';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 100;

  public powers = [
    {
      name: 'Energy Trans',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'As often as you like during your turn (before your attack), move a G Energy card attached to 1 of your ' +
        'Pokémon to another of your Pokémon. This power can\'t be used if Sceptile is affected by a Special ' +
        'Condition.',
    },
  ];

  public attacks = [
    {
      name: 'Tail Rap',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50×',
      text: 'Flip 2 coins. This attack does 50 damage times the number of heads.',
    },
  ];

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.WATER, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Sceptile';

  public fullName: string = 'Sceptile RS-2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = useEnergyTrans(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(
        state,
        [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)],
        results => {
          let heads: number = 0;
          results.forEach(r => {
            heads += r ? 1 : 0;
          });
          effect.damage = 50 * heads;
        }
      );
    }

    return state;
  }
}
