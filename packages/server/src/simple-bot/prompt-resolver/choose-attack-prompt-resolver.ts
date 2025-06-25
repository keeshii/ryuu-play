import { Player, State, Action, ResolvePromptAction, Prompt, Attack, GamePhase, Power } from '@ptcg/common';
import { PromptResolver } from './prompt-resolver';
import { ChooseAttackPrompt } from '@ptcg/common';


export class ChooseAttackPromptResolver extends PromptResolver {

  public resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined {
    if (prompt instanceof ChooseAttackPrompt) {
      let result: Attack | Power | null = null;

      if (prompt.options.enableAttack) {
        result = this.buildAttackToChoose(state, prompt);
      }

      // Attacks not available, so let's choose an ability (if possible)
      if (result === null) {
        result = this.buildAbilityToChoose(state, prompt);
      }

      // const result: Attack | null = this.buildAttackToChoose(state, prompt);
      return new ResolvePromptAction(prompt.id, result);
    }
  }

  private buildAttackToChoose(state: State, prompt: ChooseAttackPrompt): Attack | null {
    const attacks: Attack[] = [];

    // Foul Play is banned, because when Zoroark meet's another Zoroak
    // they would copy theirs attacks in the infinite loop.
    const banned: string[] = state.phase === GamePhase.ATTACK
      ? ['Foul Play', 'Metronome'] : [];

    prompt.cards.forEach((card, index) => {
      card.attacks.forEach(attack => {
        const isBlocked = prompt.options.blocked.some(b => {
          return b.index === index && b.name === attack.name;
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

  private buildAbilityToChoose(state: State, prompt: ChooseAttackPrompt): Power | null {
    const powers: Power[] = [];

    prompt.cards.forEach((card, index) => {
      const cardPowers: Power[] = [];

      if (prompt.options.enableAbility.useWhenInPlay) {
        cardPowers.push(...card.powers.filter(p => p.useWhenInPlay));
      }
      if (prompt.options.enableAbility.useFromHand) {
        cardPowers.push(...card.powers.filter(p => p.useFromHand));
      }
      if (prompt.options.enableAbility.useFromDiscard) {
        cardPowers.push(...card.powers.filter(p => p.useFromDiscard));
      }

      cardPowers.forEach(power => {
        const isBlocked = prompt.options.blocked.some(b => {
          return b.index === index && b.name === power.name;
        });
        if (!isBlocked) {
          powers.push(power);
        }
      });
    });

    // Prefer powers with longer text ;)
    powers.sort((a, b) => b.text.length - a.text.length);

    return powers.length > 0 ? powers[0] : null;
  }

}
