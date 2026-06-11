import { Player, State, Action, ResolvePromptAction, Prompt, StateUtils, CardType } from '@ptcg/common';
import { PromptResolver } from './prompt-resolver';
import { ChooseEnergyPrompt, EnergyMap } from '@ptcg/common';


export class ChooseEnergyPromptResolver extends PromptResolver {

  public resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined {
    if (prompt instanceof ChooseEnergyPrompt) {
      let result: EnergyMap[] = [];
      // const provides = prompt.energy.slice();
      const costs: CardType[] = prompt.cost.filter(c => c !== CardType.COLORLESS);

      const provides: EnergyMap[] = [];
      // Expand each EnergyMap into individual energy units according to provideAmount
      prompt.energy.forEach(e => {
        for (let i = 0; i < e.provideAmount; i++) {
          provides.push(e);
        }
      });

      // First use energies that are providing less energy types
      provides.sort((a, b) => a.provides.length - b.provides.length);

      while (costs.length > 0 && provides.length > 0) {
        const cost = costs[0];
        const index = provides.findIndex(p => p.provides.includes(cost));

        if (index === -1) {
          break; // impossible to pay for the cost
        }

        const provide = provides[index];
        provides.splice(index, 1);
        if (!result.some(r => r.card === provide.card)) {
          result.push(provide);
        }

        costs.shift();
      }

      if (costs.length > 0) {
        // Impossible to pay for the cost, try to cancel
        return new ResolvePromptAction(prompt.id, null);
      }

      const remainingEnergies = prompt.energy.filter(p => !result.includes(p));

      // Only colorless energies are remaining to pay
      // Sort rest of the provided energies by the score
      // (Number of provided energy, provided type)
      remainingEnergies.sort((p1, p2) => {
        const score1 = this.getEnergyCardScore(p1.provides, p1.provideAmount);
        const score2 = this.getEnergyCardScore(p2.provides, p2.provideAmount);
        return score1 - score2;
      });

      // Add energies until all colorless cost is paid
      while (remainingEnergies.length > 0 && !StateUtils.checkEnoughEnergy(result, prompt.cost)) {
        const provide = remainingEnergies.shift();
        if (provide !== undefined) {
          result.push(provide);
        }
      }

      // Make sure we have used only the required energies to pay
      let needCheck = true;
      while (needCheck) {
        needCheck = false;
        for (let i = 0; i < result.length; i++) {
          const tempCards = result.slice();
          tempCards.splice(i, 1);
          const enough = StateUtils.checkEnoughEnergy(tempCards, prompt.cost);
          if (enough) {
            result = tempCards;
            needCheck = true;
            break;
          }
        }
      }

      return new ResolvePromptAction(prompt.id, result);
    }
  }

  private getEnergyCardScore(provides: CardType[], provideAmount: number): number {
    let score = 0;
    provides.forEach(c => {
      if (c === CardType.COLORLESS) {
        score += 2;
      } else {
        score += 3;
      }
    });
    return provideAmount * score;
  }

}
