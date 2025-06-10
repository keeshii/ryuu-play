import { BetweenTurnsEffect, Effect, PlayerType, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '@ptcg/common';

export class OranBerry extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'RS';

  public name: string = 'Oran Berry';

  public fullName: string = 'Oran Berry RS';

  public text: string =
    'At any time between turns, if the Pokémon this card is attached to has at least 2 damage counters on it, ' +
    'remove 2 damage counters from it. Then discard Oran Berry.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof BetweenTurnsEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, pokemonSlot => {
        if (pokemonSlot.trainers.cards.includes(this) && pokemonSlot.damage >= 20) {
          pokemonSlot.damage -= 20;
          pokemonSlot.moveCardTo(this, player.discard);
        }
      });

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, pokemonSlot => {
        if (pokemonSlot.trainers.cards.includes(this) && pokemonSlot.damage >= 20) {
          pokemonSlot.damage -= 20;
          pokemonSlot.moveCardTo(this, opponent.discard);
        }
      });
    }

    return state;
  }
}
