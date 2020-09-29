import { Action, Player, State, PlayCardAction, TrainerCard, TrainerType,
  CardTarget, PlayerType, SlotType} from "../../game";
import { SimpleTactic } from "./simple-tactics";

export class AttachToolTactic extends SimpleTactic {

  private readonly minAttachToolScore = 70;

  public useTactic(state: State, player: Player): Action | undefined {
    const tools = player.hand.cards.filter(c => {
      return c instanceof TrainerCard && c.trainerType === TrainerType.TOOL;
    });

    if (tools.length === 0) {
      return;
    }

    const targets: { target: CardTarget, score: number }[] = [];
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemon, target) => {
      if (cardList.tool !== undefined) {
        return;
      }

      // Better to assign tool to the active Pokemon
      let score = target.slot === SlotType.ACTIVE ? 50 : 0;

      // More HP left is better
      score += pokemon.hp - cardList.damage;

      if (score >= this.minAttachToolScore) {
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
