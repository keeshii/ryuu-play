import {
  AttackEffect,
  CardType,
  Effect,
  EnergyType,
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

function* useHiddenPower(
  next: Function,
  store: StoreLike,
  state: State,
  effect: AttackEffect
): IterableIterator<State> {
  const player = effect.player;

  return store.prompt(
    state,
    new MoveEnergyPrompt(
      effect.player.id,
      GameMessage.MOVE_ENERGY_CARDS,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      { energyType: EnergyType.BASIC },
      { allowCancel: true }
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

export class UnownR extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 60;

  public weakness = [{ type: CardType.PSYCHIC, value: 10 }];

  public retreat = [CardType.COLORLESS];

  public powers = [
    {
      name: 'Retire',
      useWhenInPlay: true,
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn, if Unown !R is on your Bench, you may ' +
        'discard Unown !R and all cards attached to it. (This doesn\'t count ' +
        'as a Knocked Out Pokémon.) Then, draw a card.',
    },
  ];

  public attacks = [
    {
      name: 'Hidden Power',
      cost: [],
      damage: '',
      text:
        'Move any number of basic Energy cards attached to your Pokémon ' +
        'to your other Pokémon in any way you like.',
    },
  ];

  public set: string = 'DP';

  public name: string = 'Unown !R';

  public fullName: string = 'Unown R PL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);

      // check if UnownR is on player's Bench
      if (pokemonSlot === undefined) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      const benchIndex = player.bench.indexOf(pokemonSlot);
      if (benchIndex === -1) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      player.bench[benchIndex].moveTo(player.discard);
      player.bench[benchIndex].clearEffects();
      player.deck.moveTo(player.hand, 1);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useHiddenPower(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
