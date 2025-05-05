import { State } from '../../game';
import { SimpleScore } from './score';

export class BenchScore extends SimpleScore {

  public getScore(state: State, playerId: number): number {
    const player = this.getPlayer(state, playerId);
    const scores = this.options.scores.bench;
    
    let score = 0;
    player.bench.forEach(b => { score += this.getPokemonScoreBy(scores, b); });
    return score;
  }

}
