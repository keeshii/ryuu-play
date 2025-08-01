import {
  AttachEnergyPrompt,
  AttackEffect,
  CardTag,
  CardType,
  CheckProvidedEnergyEffect,
  Effect,
  GameMessage,
  PlayerType,
  PokemonCard,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class YveltalEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.DARK];

  public hp: number = 170;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Evil Ball',
      cost: [CardType.DARK, CardType.COLORLESS],
      damage: '20+',
      text: 'This attack does 20 more damage times the amount of Energy attached to both Active Pokémon.',
    },
    {
      name: 'Y Cyclone',
      cost: [CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
      damage: '90',
      text: 'Move an Energy from this Pokémon to 1 of your Benched Pokémon.',
    },
  ];

  public set: string = 'BW2';

  public name: string = 'Yveltal EX';

  public fullName: string = 'Yveltal EX XY';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const playerProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, playerProvidedEnergy);
      const playerEnergyCount = playerProvidedEnergy.energyMap.reduce((left, p) => left + p.provides.length, 0);

      const opponentProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, opponentProvidedEnergy);
      const opponentEnergyCount = opponentProvidedEnergy.energyMap.reduce((left, p) => left + p.provides.length, 0);

      effect.damage += (playerEnergyCount + opponentEnergyCount) * 20;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.pokemons.cards.length > 0);

      if (hasBench === false) {
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
          { },
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
