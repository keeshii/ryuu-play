import { State, StateUtils, PlayerType } from '@ptcg/common';
import { SimpleScore } from './score';


export class OpponentScore extends SimpleScore {

  public getScore(state: State, playerId: number): number {
    const player = this.getPlayer(state, playerId);
    const opponent = StateUtils.getOpponent(state, player);
    const scores = this.options.scores.opponent;

    let score = 0;

    // for each card in the opponents deck
    score += scores.deck * opponent.deck.cards.length;

    // for each card in the opponents hand
    score += scores.hand * opponent.hand.cards.length;

    // bonus if opponent's bench is empty
    const isBenchEmpty = opponent.bench.every(b => b.pokemons.cards.length === 0);
    if (isBenchEmpty) {
      score += scores.emptyBench;
    }

    // Opponent's active has no attached energy
    const noActiveEnergy = opponent.active.energies.cards.length === 0;
    if (noActiveEnergy) {
      score += scores.noActiveEnergy;
    }

    opponent.forEachPokemon(PlayerType.TOP_PLAYER, pokemonSlot => {
      const energies = pokemonSlot.energies.cards;
      score += scores.energy * energies.length;
      score += scores.board * (
        pokemonSlot.pokemons.cards.length
        + pokemonSlot.energies.cards.length
        + pokemonSlot.trainers.cards.length
      );
    });

    return score;
  }

}
