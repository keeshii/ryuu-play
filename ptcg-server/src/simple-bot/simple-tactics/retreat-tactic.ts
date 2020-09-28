import { Action, Player, State, RetreatAction } from "../../game";
import { SimpleTactic } from "./simple-tactics";

export class RetreatTactic extends SimpleTactic {

  public useTactic(state: State, player: Player): Action | undefined {

    let bestScore = this.getStateScore(state, player);
    let retreatAction: RetreatAction | undefined;
    player.bench.forEach((bench, index) => {
      if (bench.cards.length === 0) {
        return;
      }

      const action = new RetreatAction(player.id, index);
      const score = this.evaluateAction(state, player, action);

      if (score !== undefined && bestScore < score) {
        bestScore = score;
        retreatAction = action;
      }
    });

    return retreatAction;
  }

}
