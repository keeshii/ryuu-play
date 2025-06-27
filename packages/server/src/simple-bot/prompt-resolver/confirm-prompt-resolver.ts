import { Player, State, Action, ResolvePromptAction, Prompt, GameMessage } from '@ptcg/common';
import { PromptResolver } from './prompt-resolver';
import { ConfirmPrompt } from '@ptcg/common';
import { ShowCardsPrompt } from '@ptcg/common';


export class ConfirmPromptResolver extends PromptResolver {

  public resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined {

    if (prompt instanceof ShowCardsPrompt) {
      if (prompt.message === GameMessage.SETUP_OPPONENT_NO_BASIC) {
        const result = player.hand.cards.length < 15 ? true : null;
        return new ResolvePromptAction(prompt.id, result);
      }
      return new ResolvePromptAction(prompt.id, true);
    }

    if (prompt instanceof ConfirmPrompt) {
      /* eslint-disable no-fallthrough */
      switch (prompt.message) {
        // Probably an attack effect - do more damage when you discard energy,
        // Let's don't discard those energies, otherwise AI will end up with
        // all energies in discard
        case GameMessage.WANT_TO_DISCARD_ENERGY:
        case GameMessage.WANT_TO_PICK_UP_POKEMON:
        case GameMessage.WANT_TO_SHUFFLE_POKEMON_INTO_DECK:
          return new ResolvePromptAction(prompt.id, false);
        // Probably fossils. Let's AI evaluate if discarding fossil is good
        case GameMessage.WANT_TO_DISCARD_POKEMON:
        // The effects below are porbably good, so let's agree
        case GameMessage.WANT_TO_DRAW_CARDS:
        case GameMessage.WANT_TO_PLAY_BOTH_CARDS_AT_ONCE:
        case GameMessage.WANT_TO_SWITCH_POKEMON:
        case GameMessage.WANT_TO_USE_ABILITY:
          return new ResolvePromptAction(prompt.id, true);
        default:
          return new ResolvePromptAction(prompt.id, false);
      }
      /* eslint-enable no-fallthrough */
    }
  }

}
