import { State } from '../../game';
import { SimpleScore } from './score';

export class ActiveScore extends SimpleScore {

  public getScore(state: State, playerId: number): number {
    const player = this.getPlayer(state, playerId);
    return this.getPokemonScoreBy(this.options.scores.active, player.active);
  }

}
