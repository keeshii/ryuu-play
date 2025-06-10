import {
  Effect,
  HealEffect,
  PlayerType,
  State,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

export class PokemonCenter extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS';

  public name: string = 'Pokémon Center';

  public fullName: string = 'Pokémon Center BS';

  public text: string =
    'Remove all damage counters from all of your own Pokémon with damage counters on them, then discard all Energy ' +
    'cards attached to those Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, pokemonSlot => {
        if (pokemonSlot.damage > 0) {
          const damage = pokemonSlot.damage;
          const healEffect = new HealEffect(player, pokemonSlot, damage);
          state = store.reduceEffect(state, healEffect);

          pokemonSlot.energies.moveTo(player.discard);
        }
      });
    }

    return state;
  }
}
