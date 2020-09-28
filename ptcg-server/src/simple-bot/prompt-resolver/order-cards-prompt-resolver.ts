import { Player, State, Action, ResolvePromptAction, Prompt } from '../../game';
import { PromptResolver } from './prompt-resolver';
import { OrderCardsPrompt } from '../../game/store/prompts/order-cards-prompt';


export class OrderCardsPromptResolver extends PromptResolver {

  public resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined {
    if (prompt instanceof OrderCardsPrompt) {
      if (prompt.options.allowCancel) {
        return new ResolvePromptAction(prompt.id, null);
      }
      const result: number[] = [];
      prompt.cards.cards.forEach((c, index) => result.push(index));
      return new ResolvePromptAction(prompt.id, result);
    }
  }

}
