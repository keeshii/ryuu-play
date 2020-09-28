import { Player, State, Action, ResolvePromptAction, Prompt } from '../../game';
import { PromptResolver } from './prompt-resolver';
import { AlertPrompt } from '../../game/store/prompts/alert-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';


export class AlertPromptResolver extends PromptResolver {

  public resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined {
    if (prompt instanceof AlertPrompt || prompt instanceof ShowCardsPrompt) {
      return new ResolvePromptAction(prompt.id, 0);
    }
  }

}
