import { Player, State, Action, ResolvePromptAction, Prompt, StateUtils } from '../../game';
import { PromptResolver } from './prompt-resolver';
import { ChooseEnergyPrompt, EnergyMap } from '../../game/store/prompts/choose-energy-prompt';


export class ChooseEnergyPromptResolver extends PromptResolver {

  public resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined {
    if (prompt instanceof ChooseEnergyPrompt) {
      const result: EnergyMap[] = prompt.energy.slice();
      while (result.length > 0 && !StateUtils.checkExactEnergy(result, prompt.cost)) {
        result.splice(result.length - 1, 1);
      }
      return new ResolvePromptAction(prompt.id, result);
    }
  }

}
