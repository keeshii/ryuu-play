import { Player, State, Action, ResolvePromptAction, Prompt, Attack, GamePhase} from '@ptcg/common';
import { PromptResolver } from './prompt-resolver';
import { ChooseAttackPrompt } from '@ptcg/common';


export class ChooseAttackPromptResolver extends PromptResolver {

  public resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined {
    if (prompt instanceof ChooseAttackPrompt) {
      const result: Attack | null = this.buildAttackToChoose(state, prompt);
      return new ResolvePromptAction(prompt.id, result);
    }
  }

  private buildAttackToChoose(state: State, prompt: ChooseAttackPrompt): Attack | null {
    const attacks: Attack[] = [];

    // Foul Play is banned, because when Zoroark meet's another Zoroak
    // they would copy theirs attacks in the infinite loop.
    const banned: string[] = state.phase === GamePhase.ATTACK
      ? ['Foul Play'] : [];

    prompt.cards.forEach((card, index) => {
      card.attacks.forEach(attack => {
        const isBlocked = prompt.options.blocked.some(b => {
          return b.index === index && b.attack === attack.name;
        });
        if (!isBlocked && !banned.includes(attack.name)) {
          attacks.push(attack);
        }
      });
    });

    attacks.sort((a, b) => {
      const damage1 = parseInt(a.damage, 10) || 0;
      const damage2 = parseInt(b.damage, 10) || 0;
      if (damage1 !== damage2) {
        return damage2 - damage1;
      }
      return b.cost.length - a.cost.length;
    });

    return attacks.length > 0 ? attacks[0] : null;
  }

}
