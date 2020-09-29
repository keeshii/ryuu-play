import { Action, Player, State, TrainerCard, TrainerType, PlayCardAction,
  PlayerType, SlotType } from "../../game";
import { SimpleTactic } from "./simple-tactics";

export class PlaySupporterTactic extends SimpleTactic {

  public useTactic(state: State, player: Player): Action | undefined {
    if (player.supporterPlayedTurn >= state.turn) {
      return;
    }

    const supporters = player.hand.cards.filter(c => {
      return c instanceof TrainerCard && c.trainerType === TrainerType.SUPPORTER;
    });

    if (supporters.length === 0) {
      return;
    }

    const target = { player: PlayerType.ANY, slot: SlotType.BOARD, index: 0 };
    let bestScore = this.getStateScore(state, player.id);
    let playCardAction: PlayCardAction | undefined;

    supporters.forEach(card => {
      const index = player.hand.cards.indexOf(card);
      const action = new PlayCardAction(player.id, index, target);
      const score = this.evaluateAction(state, player.id, action);

      if (score !== undefined && bestScore < score) {
        bestScore = score;
        playCardAction = action;
      }
    });

    return playCardAction;
  }

}
