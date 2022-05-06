import { Action, Player, State, TrainerCard, TrainerType, PlayCardAction,
  PlayerType, SlotType, StateUtils } from '../../game';
import { SimpleTactic } from './simple-tactics';

export class PlayStadiumTactic extends SimpleTactic {

  public useTactic(state: State, player: Player): Action | undefined {
    // Don't discard your own stadium cards
    if (player.stadiumPlayedTurn >= state.turn || player.stadium.cards.length > 0) {
      return;
    }

    let stadiums = player.hand.cards.filter(c => {
      return c instanceof TrainerCard && c.trainerType === TrainerType.STADIUM;
    });

    // Don't play stadiums of the same name as current stadium
    const currentStadium = StateUtils.getStadiumCard(state);
    if (currentStadium) {
      stadiums = stadiums.filter(c => c.fullName !== currentStadium.fullName);
    }

    if (stadiums.length === 0) {
      return;
    }

    const index = player.hand.cards.indexOf(stadiums[0]);
    const target = { player: PlayerType.ANY, slot: SlotType.BOARD, index: 0 };
    return new PlayCardAction(player.id, index, target);
  }

}
