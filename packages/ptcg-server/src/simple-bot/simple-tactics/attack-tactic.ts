import { Action, Player, State, SpecialCondition, AttackAction } from '../../game';
import { SimpleTactic } from './simple-tactics';

export class AttackTactic extends SimpleTactic {

  public useTactic(state: State, player: Player): Action | undefined {
    const sp = player.active.specialConditions;
    if (sp.includes(SpecialCondition.PARALYZED) || sp.includes(SpecialCondition.ASLEEP)) {
      return undefined;
    }

    const active = player.active.getPokemonCard();
    if (!active) {
      return undefined;
    }

    const attackBonus = this.options.scores.tactics.attackBonus;
    let bestScore = this.getStateScore(state, player.id) - attackBonus;
    let attackAction: AttackAction | undefined;

    active.attacks.forEach(attack => {
      const action = new AttackAction(player.id, attack.name);
      const score = this.evaluateAction(state, player.id, action);

      if (score !== undefined && bestScore < score) {
        bestScore = score;
        attackAction = action;
      }
    });

    return attackAction;
  }

}
