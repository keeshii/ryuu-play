import { Action, Player, State, TrainerCard, TrainerType, PlayCardAction,
  PlayerType, SlotType } from '../../game';
import { SimpleTactic } from './simple-tactics';

export class PlayTrainerTactic extends SimpleTactic {

  public useTactic(state: State, player: Player): Action | undefined {
    const trainers = player.hand.cards.filter(c => {
      return c instanceof TrainerCard && c.trainerType === TrainerType.ITEM;
    });

    if (trainers.length === 0) {
      return;
    }

    const target = { player: PlayerType.ANY, slot: SlotType.BOARD, index: 0 };
    let bestScore = this.getStateScore(state, player.id);
    let playCardAction: PlayCardAction | undefined;

    trainers.forEach(card => {
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
