import { State, StateUtils, PlayerType, SlotType } from '../../game';
import { SimpleScore } from './score';

export class DamageScore extends SimpleScore {

  public getScore(state: State, playerId: number): number {
    const player = this.getPlayer(state, playerId);
    const opponent = StateUtils.getOpponent(state, player);

    let pokemonScoreSum = 0;
    let score = 0;

    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
      const [ pokemonScores, multipier ] = target.slot === SlotType.ACTIVE
        ? [ this.options.scores.active, this.options.scores.damage.playerActive ]
        : [ this.options.scores.bench, this.options.scores.damage.playerBench ];

      const pokemonScore = this.getPokemonScoreBy(pokemonScores, cardList);
      pokemonScoreSum += pokemonScore;
      score += multipier * pokemonScore * cardList.damage;
    });

    opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
      const [ pokemonScores, multipier ] = target.slot === SlotType.ACTIVE
        ? [ this.options.scores.active, this.options.scores.damage.opponentActive ]
        : [ this.options.scores.bench, this.options.scores.damage.opponentBench ];

      const pokemonScore = this.getPokemonScoreBy(pokemonScores, cardList);
      pokemonScoreSum += pokemonScore;
      score += multipier * pokemonScore * cardList.damage;
    });

    score = Math.round(score / pokemonScoreSum);
    return score;
  }

}
