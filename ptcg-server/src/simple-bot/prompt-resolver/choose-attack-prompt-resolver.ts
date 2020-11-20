import { Player, State, Action, ResolvePromptAction, Prompt, Attack} from '../../game';
import { PromptResolver } from './prompt-resolver';
import { ChooseAttackPrompt } from '../../game/store/prompts/choose-attack-prompt';


export class ChooseAttackPromptResolver extends PromptResolver {

  public resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined {
    if (prompt instanceof ChooseAttackPrompt) {
      let result: Attack | null = this.buildAttackToChoose(state, prompt);
      return new ResolvePromptAction(prompt.id, result);
    }
  }

  private buildAttackToChoose(state: State, prompt: ChooseAttackPrompt): Attack | null {
    const attacks: Attack[] = [];
    prompt.cards.forEach((card, index) => {
      card.attacks.forEach(attack => {
        const isBlocked = prompt.options.blocked.some(b => {
          return b.index === index && b.attack === attack.name;
        });
        if (!isBlocked) {
          attacks.push(attack)
        }
      });
    });

    attacks.sort((a, b) => {
      if (a.damage !== b.damage) {
        return b.damage - a.damage;
      }
      return b.cost.length - a.cost.length;
    });

    return attacks.length > 0 ? attacks[0] : null;
  }

}
