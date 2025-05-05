import { Action, Player, State, PlayCardAction, TrainerCard, TrainerType,
  CardTarget, PlayerType} from '../../game';
import { SimpleTactic } from './simple-tactics';

export class AttachToolTactic extends SimpleTactic {

  public useTactic(state: State, player: Player): Action | undefined {
    const tools = player.hand.cards.filter(c => {
      return c instanceof TrainerCard && c.trainerType === TrainerType.TOOL;
    });

    if (tools.length === 0) {
      return;
    }

    const tool = tools[0];
    const baseScore = this.getStateScore(state, player.id);

    const targets: { target: CardTarget, score: number }[] = [];
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemon, target) => {
      if (cardList.tool !== undefined) {
        return;
      }

      cardList.tool = tool;
      const score = this.getStateScore(state, player.id);
      cardList.tool = undefined;

      if (score > baseScore) {
        targets.push({ target, score });
      }
    });

    if (targets.length === 0) {
      return;
    }

    targets.sort((a, b) => b.score - a.score);
    const target = targets[0].target;
    const index = player.hand.cards.indexOf(tools[0]);
    return new PlayCardAction(player.id, index, target); 
  }

}
