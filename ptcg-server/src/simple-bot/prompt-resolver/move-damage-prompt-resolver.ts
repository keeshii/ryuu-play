import { Player, State, Action, ResolvePromptAction, Prompt, MoveDamagePrompt,
  DamageTransfer } from '../../game';
import { PutDamagePromptResolver } from './put-damage-prompt-resolver';


export class MoveDamagePromptResolver extends PutDamagePromptResolver {

  public resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined {
    if (prompt instanceof MoveDamagePrompt) {
      const result = this.getMoveDamagePromptResult(state, prompt);
      return new ResolvePromptAction(prompt.id, result);
    }
  }

  private getMoveDamagePromptResult(state: State, prompt: MoveDamagePrompt): DamageTransfer[] | null {
    let fromItems = this.getTargets(state, prompt, prompt.options.blockedFrom);
    const toItems = this.getTargets(state, prompt, prompt.options.blockedTo);

    fromItems.reverse();
    fromItems = fromItems.filter(i => i.cardList.damage);

    const result: DamageTransfer[] = [];
    let score = 0;
    let isNegative = false;

    const min = prompt.options.min;
    const max = prompt.options.max;
    let fromIndex = 0;
    let toIndex = 0;

    while (fromIndex < fromItems.length && toIndex < toItems.length && (!isNegative || result.length < min)) {
      const fromItem = fromItems[fromIndex];
      const toItem = toItems[toIndex];
      if (fromItem === undefined || toItem === undefined) {
        break;
      }

      if (fromItem.score >= toItem.score) {
        isNegative = true;
      }

      // Moving any card gives negative score, and we are able to cancel
      // Don't append any results, just cancel the prompt
      if (isNegative && prompt.options.allowCancel) {
        break;
      }

      // Score is negative, and we already have minimum transfers
      if (isNegative && result.length >= min) {
        break;
      }

      if (toItem.cardList === fromItem.cardList) {
        toIndex += 1;
      }

      if (toItem.cardList !== fromItem.cardList) {
        fromItem.damage -= 10;
        toItem.damage += 10;
        score += toItem.score - fromItem.score;
        result.push({ from: fromItem.target, to: toItem.target });

        if (fromItem.damage <= 0) {
          fromIndex += 1;
        }

        if (toItem.hp - toItem.damage <= 0) {
          toIndex += 1;
        }

        if (max !== undefined && result.length >= max) {
          break;
        }
      }
    }

    if (result.length === 0 && prompt.options.allowCancel) {
      return null;
    }

    if (score < 0 && prompt.options.allowCancel) {
      return null;
    }

    return result;
  }

}
