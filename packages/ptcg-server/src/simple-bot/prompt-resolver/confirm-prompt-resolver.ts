import { Player, State, Action, ResolvePromptAction, Prompt, GameMessage } from '../../game';
import { PromptResolver } from './prompt-resolver';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';


export class ConfirmPromptResolver extends PromptResolver {

  public resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined {
    if (prompt instanceof ConfirmPrompt) {
      return new ResolvePromptAction(prompt.id, false);
    }

    if (prompt instanceof ShowCardsPrompt) {
      if (prompt.message === GameMessage.SETUP_OPPONENT_NO_BASIC) {
        const result = player.hand.cards.length < 15 ? true : null;
        return new ResolvePromptAction(prompt.id, result);
      }
      return new ResolvePromptAction(prompt.id, true);
    }
  }

}
