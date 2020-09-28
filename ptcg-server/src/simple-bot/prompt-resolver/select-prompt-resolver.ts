import { Player, State, Action, ResolvePromptAction, Prompt } from '../../game';
import { PromptResolver } from './prompt-resolver';
import { SelectPrompt } from '../../game/store/prompts/select-prompt';


export class SelectPromptResolver extends PromptResolver {

  public resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined {
    if (prompt instanceof SelectPrompt) {
      const result = 0;
      return new ResolvePromptAction(prompt.id, result);
    }
  }

}
