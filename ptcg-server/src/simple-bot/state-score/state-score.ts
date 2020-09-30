import { State } from '../../game';
import { SimpleScore } from './score';
import { SimpleBotOptions } from '../simple-bot-options';
import { HandScore } from './hand-score';
import { OpponentScore } from './opponent-score';
import { PlayerScore } from './player-score';
import { SpecialConditionsScore } from './special-conditions-score';

export class StateScore extends SimpleScore {

  private handScore: HandScore;
  private opponentScore: OpponentScore;
  private playerScore: PlayerScore;
  private specialConditionsScore: SpecialConditionsScore;

  constructor(protected options: SimpleBotOptions) {
    super(options);
    this.handScore = new HandScore(options);
    this.opponentScore = new OpponentScore(options);
    this.playerScore = new PlayerScore(options);
    this.specialConditionsScore = new SpecialConditionsScore(options);
  }

  public getScore(state: State, playerId: number): number {
    const handScore = this.handScore.getScore(state, playerId);
    const opponentScore = this.opponentScore.getScore(state, playerId);
    const playerScore = this.playerScore.getScore(state, playerId);
    const specialConditionsScore = this.specialConditionsScore.getScore(state, playerId);

    const score = handScore
      + opponentScore
      + playerScore
      + specialConditionsScore;

    return score;
  }

}
