import { Player, State, Action, ResolvePromptAction, Prompt, EnergyCard, CardType } from '@ptcg/common';
import { PromptResolver } from './prompt-resolver';
import { SelectPrompt } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';


export class SelectPromptResolver extends PromptResolver {

  public resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined {
    if (prompt instanceof SelectPrompt) {
      const result = this.handleDiscardAllEnergiesPrompt(state, player, prompt);
      return new ResolvePromptAction(prompt.id, result || 0);
    }
  }

  private handleDiscardAllEnergiesPrompt(state: State, player: Player, prompt: SelectPrompt): number | undefined {
    const values = [ GameMessage.TYPE_FIRE, GameMessage.TYPE_LIGHTNING ];

    // Different kind of the select message
    if (prompt.message !== GameMessage.CHOOSE_ENERGIES_TO_DISCARD
      || prompt.values.length !== values.length
      || prompt.values.some((value, index) => value !== values[index])) {
      return undefined;
    }

    const energies = player.hand.cards.filter(c => c instanceof EnergyCard) as EnergyCard[];
    const fire = energies.filter(e => e.provides.includes(CardType.FIRE));
    const lightning = energies.filter(e => e.provides.includes(CardType.LIGHTNING));

    if (lightning.length >= fire.length) {
      return 1;
    }

    return 0;
  }

}
