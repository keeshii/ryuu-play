import { State, PlayerType } from '@ptcg/common';
import { SimpleScore } from './score';
import { EnergyCard } from '@ptcg/common';
import { PokemonCard } from '@ptcg/common';
import { Stage, TrainerType } from '@ptcg/common';
import { TrainerCard } from '@ptcg/common';


export class HandScore extends SimpleScore {

  public getScore(state: State, playerId: number): number {
    const player = this.getPlayer(state, playerId);
    const scores = this.options.scores.hand;

    const isBenchEmpty = player.bench.every(b => b.pokemons.cards.length === 0);

    const pokemonsToEvolve: string[] = [];
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
      if (cardList.pokemonPlayedTurn < state.turn) {
        pokemonsToEvolve.push(card.name);
      }
    });

    let score = 0;
    let hasEnergy = false;
    let hasPokemon = false;
    let hasBasic = false;
    let hasSupporter = false;

    player.hand.cards.forEach(c => {
      if (c instanceof EnergyCard) {
        hasEnergy = true;
        score += scores.cardScore;
      } else if (c instanceof PokemonCard) {
        hasPokemon = true;
        score += scores.cardScore;
        if (c.stage === Stage.BASIC) {
          hasBasic = true;
        }
        const index = pokemonsToEvolve.indexOf(c.evolvesFrom);
        if (index !== -1) {
          score += scores.evolutionScore;
          pokemonsToEvolve.splice(index, 1);
        }
      } else if (c instanceof TrainerCard) {
        if (c.trainerType === TrainerType.SUPPORTER) {
          hasSupporter = true;
        }
        score += scores.itemScore;
      }
    });

    if (hasEnergy) {
      score += scores.hasEnergy;
    }

    if (hasPokemon) {
      score += scores.hasPokemon;
    }

    if (hasBasic && isBenchEmpty) {
      score += scores.hasBasicWhenBenchEmpty;
    }

    if (hasSupporter) {
      score += scores.hasSupporter;
    }

    return score;
  }

}
