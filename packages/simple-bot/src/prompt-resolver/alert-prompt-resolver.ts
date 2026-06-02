import { Player, State, Action, ResolvePromptAction, Prompt } from '@ptcg/common';
import { PromptResolver } from './prompt-resolver';
import { AlertPrompt } from '@ptcg/common';


export class AlertPromptResolver extends PromptResolver {

  public resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined {
    if (prompt instanceof AlertPrompt) {
      return new ResolvePromptAction(prompt.id, true);
    }
  }

}
