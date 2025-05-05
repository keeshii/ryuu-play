import { Action, Player, State, UseAbilityAction, PlayerType } from '../../game';
import { SimpleTactic } from './simple-tactics';

export class UseAbilityTactic extends SimpleTactic {

  public useTactic(state: State, player: Player): Action | undefined {
    let bestScore = this.getStateScore(state, player.id);
    let useAbilityAction: UseAbilityAction | undefined;
    const passTurnScore = this.options.scores.tactics.passTurn;

    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
      for (const power of card.powers) {
        if (power.useWhenInPlay) {
          const action = new UseAbilityAction(player.id, power.name, target);
          const score = this.evaluateAction(state, player.id, action, passTurnScore);

          if (score !== undefined && bestScore < score) {
            bestScore = score;
            useAbilityAction = action;
          }
        }
      }
    });

    return useAbilityAction;
  }

}
