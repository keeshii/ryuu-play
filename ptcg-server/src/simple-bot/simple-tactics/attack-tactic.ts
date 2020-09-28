import { Action, Player, State, SpecialCondition, EnergyMap, EnergyCard,
  StateUtils, AttackAction } from "../../game";
import { SimpleTactic } from "./simple-tactics";

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

    for (let i = active.attacks.length - 1; i >= 0; i--) {
      const attack = active.attacks[i];

      const energy: EnergyMap[] = [];
      player.active.cards.forEach(card => {
        if (card instanceof EnergyCard) {
          energy.push({ card, provides: card.provides });
        }
      });

      if (StateUtils.checkEnoughEnergy(energy, attack.cost)) {
        return new AttackAction(player.id, attack.name);
      }
    }
  }

}
