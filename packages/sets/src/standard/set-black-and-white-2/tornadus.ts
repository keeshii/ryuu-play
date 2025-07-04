import {
  AttachEnergyPrompt,
  AttackEffect,
  CardTarget,
  CardType,
  Effect,
  EnergyType,
  GameMessage,
  MoveEnergyPrompt,
  PlayerType,
  PokemonCard,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

export class Tornadus extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 110;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Energy Wheel',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'Move an Energy from 1 of your Benched Pokémon to this Pokémon.',
    },
    {
      name: 'Hurricane',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '80',
      text: 'Move a basic Energy from this Pokémon to 1 of your Benched Pokémon.',
    },
  ];

  public set: string = 'BW2';

  public name: string = 'Tornadus';

  public fullName: string = 'Tornadus EP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const blockedFrom: CardTarget[] = [];
      const blockedTo: CardTarget[] = [];

      let hasEnergyOnBench = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, card, target) => {
        if (pokemonSlot === player.active) {
          blockedFrom.push(target);
          return;
        }
        blockedTo.push(target);
        if (pokemonSlot.energies.cards.length > 0) {
          hasEnergyOnBench = true;
        }
      });

      if (hasEnergyOnBench === false) {
        return state;
      }

      return store.prompt(
        state,
        new MoveEnergyPrompt(
          effect.player.id,
          GameMessage.MOVE_ENERGY_TO_ACTIVE,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { },
          { min: 1, max: 1, allowCancel: false, blockedFrom, blockedTo }
        ),
        result => {
          const transfers = result || [];
          transfers.forEach(transfer => {
            const source = StateUtils.getTarget(state, player, transfer.from);
            const target = StateUtils.getTarget(state, player, transfer.to);
            source.moveCardTo(transfer.card, target.energies);
          });
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.pokemons.cards.length > 0);
      const hasBasicEnergy = player.active.energies.cards.some(c => c.energyType === EnergyType.BASIC);

      if (hasBench === false || hasBasicEnergy === false) {
        return state;
      }

      return store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_TO_BENCH,
          player.active.energies,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
          { allowCancel: false, min: 1, max: 1 }
        ),
        transfers => {
          transfers = transfers || [];
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            player.active.moveCardTo(transfer.card, target.energies);
          }
        }
      );
    }

    return state;
  }
}
