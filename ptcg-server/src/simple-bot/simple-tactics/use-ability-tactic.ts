import { Action, Player, State, UseAbilityAction, PlayerType } from "../../game";
import { SimpleTactic } from "./simple-tactics";

export class UseAbilityTactic extends SimpleTactic {

  public useTactic(state: State, player: Player): Action | undefined {
    let bestScore = this.getStateScore(state, player.id);
    let useAbilityAction: UseAbilityAction | undefined;

    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
      for (const power of card.powers) {
        const action = new UseAbilityAction(player.id, power.name, target);
        const score = this.evaluateAction(state, player.id, action);

        if (score !== undefined && bestScore < score) {
          bestScore = score;
          useAbilityAction = action;
        }
      }
    });

    return useAbilityAction;
  }

}
