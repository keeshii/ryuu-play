import { State } from '../../game';
import { SimpleScore } from './score';
import { SpecialCondition } from '../../game/store/card/card-types';


export class SpecialConditionsScore extends SimpleScore {

  public getScore(state: State, playerId: number): number {
    const player = this.getPlayer(state, playerId);
    const scores = this.options.scores.specialConditions;
    let score = 0;

    player.active.specialConditions.forEach(condition => {
      switch (condition) {
        case SpecialCondition.PARALYZED:
          score += scores.paralyzed;
          break;
        case SpecialCondition.CONFUSED:
          score += scores.confused;
          break;
        case SpecialCondition.ASLEEP:
          score += scores.asleep;
          break;
        case SpecialCondition.POISONED:
          score += scores.poisoned;
          break;
        case SpecialCondition.BURNED:
          score += scores.confused;
          break;
      }
    });

    return score;
  }

}
