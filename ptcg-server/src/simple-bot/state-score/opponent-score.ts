import { State, StateUtils } from '../../game';
import { SimpleScore } from './score';


export class OpponentScore extends SimpleScore {

  public getScore(state: State, playerId: number): number {
    const player = this.getPlayer(state, playerId)
    const opponent = StateUtils.getOpponent(state, player);
    const scores = this.options.scores.opponent;

    let score = 0;

    // for each card in the opponents deck
    score += scores.deck * opponent.deck.cards.length;

    // for each card in the opponents hand
    score += scores.hand * opponent.hand.cards.length;

    // bonus if opponent's bench is empty
    const isBenchEmpty = opponent.bench.every(b => b.cards.length === 0);
    if (isBenchEmpty) {
      score += scores.emptyBench;
    }

    return score;
  }

}
