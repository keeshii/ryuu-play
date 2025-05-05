import { Player, State, Action, ResolvePromptAction, Prompt, StateUtils, CardType } from '../../game';
import { PromptResolver } from './prompt-resolver';
import { ChooseEnergyPrompt, EnergyMap } from '../../game/store/prompts/choose-energy-prompt';


export class ChooseEnergyPromptResolver extends PromptResolver {

  public resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined {
    if (prompt instanceof ChooseEnergyPrompt) {
      let result: EnergyMap[] = [];
      const provides = prompt.energy.slice();
      const costs: CardType[] = prompt.cost.filter(c => c !== CardType.COLORLESS);

      while (costs.length > 0 && provides.length > 0) {
        const cost = costs[0];
        let index = provides.findIndex(p => p.provides.includes(cost));

        if (index === -1) {
          // concrete energy not found, try to use rainbow energies
          index = provides.findIndex(p => p.provides.includes(CardType.ANY));
        }

        if (index === -1) {
          break; // impossible to pay for the cost
        }

        const provide = provides[index];
        provides.splice(index, 1);
        result.push(provide);

        provide.provides.forEach(c => {
          if (c === CardType.ANY && costs.length > 0) {
            costs.shift();
          } else {
            const i = costs.indexOf(c);
            if (i !== -1) {
              costs.splice(i, 1);
            }
          }
        });
      }

      if (costs.length > 0) {
        // Impossible to pay for the cost, try to cancel
        return new ResolvePromptAction(prompt.id, null);
      }

      // Only colorless energies are remaining to pay
      // Sort rest of the provided energies by the score
      // (Number of provided energy, provided type)
      provides.sort((p1, p2) => {
        const score1 = this.getEnergyCardScore(p1.provides);
        const score2 = this.getEnergyCardScore(p2.provides);
        return score1 - score2;
      });

      // Add energies until all colorless cost is paid
      while (provides.length > 0 && !StateUtils.checkEnoughEnergy(result, prompt.cost)) {
        const provide = provides.shift();
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

  private getEnergyCardScore(provides: CardType[]): number {
    let score = 0;
    provides.forEach(c => {
      if (c === CardType.COLORLESS) {
        score += 2;
      } else if (c === CardType.ANY) {
        score += 10;
      } else {
        score += 3;
      }
    });
    return score;
  }

}
