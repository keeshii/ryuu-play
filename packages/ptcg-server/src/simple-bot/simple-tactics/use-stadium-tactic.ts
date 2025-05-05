import { Action, Player, State, UseStadiumAction, StateUtils } from '../../game';
import { SimpleTactic } from './simple-tactics';

export class UseStadiumTactic extends SimpleTactic {

  public useTactic(state: State, player: Player): Action | undefined {
    if (player.stadiumUsedTurn >= state.turn) {
      return;
    }

    if (StateUtils.getStadiumCard(state) === undefined) {
      return;
    }

    const passTurnScore = this.options.scores.tactics.passTurn;
    const currentScore = this.getStateScore(state, player.id);
    const action = new UseStadiumAction(player.id);
    const score = this.evaluateAction(state, player.id, action, passTurnScore);

    if (score !== undefined && currentScore < score) {
      return action;
    }
  }

}
