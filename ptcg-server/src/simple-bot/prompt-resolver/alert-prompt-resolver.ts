import { Player, State, Action, ResolvePromptAction, Prompt } from '../../game';
import { PromptResolver } from './prompt-resolver';
import { AlertPrompt } from '../../game/store/prompts/alert-prompt';


export class AlertPromptResolver extends PromptResolver {

  public resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined {
    if (prompt instanceof AlertPrompt) {
      return new ResolvePromptAction(prompt.id, true);
    }
  }

}
