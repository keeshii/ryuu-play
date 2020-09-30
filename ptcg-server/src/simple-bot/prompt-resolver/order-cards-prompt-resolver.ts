import { Player, State, Action, ResolvePromptAction, Prompt } from '../../game';
import { PromptResolver } from './prompt-resolver';
import { OrderCardsPrompt } from '../../game/store/prompts/order-cards-prompt';


export class OrderCardsPromptResolver extends PromptResolver {

  public resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined {
    if (prompt instanceof OrderCardsPrompt) {
      if (prompt.options.allowCancel) {
        return new ResolvePromptAction(prompt.id, null);
      }

      const cards = prompt.cards.cards.map((card, index) => {
        const score = this.stateScore.getCardScore(state, player.id, card);
        return { card, score, index };
      });

      cards.sort((a, b) => b.score - a.score);

      const result = cards.map(c => c.index);
      return new ResolvePromptAction(prompt.id, result);
    }
  }

}
