import { CardList } from '../store/state/card-list';
import { CoinFlipPrompt } from '../store/prompts/coin-flip-prompt';
import { Prompt } from '../store/prompts/prompt';
import { ShuffleDeckPrompt } from '../store/prompts/shuffle-prompt';
import { StateLog } from '../store/state/state-log';
import { State } from '../store/state/state';
import { ResolvePromptAction } from '../store/actions/resolve-prompt-action';


export class Arbiter {

  constructor() { }

  public resolvePrompt(state: State, prompt: Prompt<any>): ResolvePromptAction | undefined {
    const player = state.players.find(p => p.id === prompt.playerId);

    if (player === undefined) {
      return;
    }

    if (prompt instanceof ShuffleDeckPrompt) {
      const result = this.shuffle(player.deck);
      const log = new StateLog(`shuffles deck from player ${player.name}.`, player.id);
      return new ResolvePromptAction(prompt.id, result, log);
    }

    if (prompt instanceof CoinFlipPrompt) {
      const result = Math.round(Math.random()) === 0;
      const message = `flips coin for player ${player.name} and result is ${result ? 'HEAD' : 'TAILS'}.`;
      const log = new StateLog(message, player.id);
      return new ResolvePromptAction(prompt.id, result, log);
    }
  }

  private shuffle(cards: CardList): number[] {
    const len = cards.cards.length;
    const order: number[] = [];

    for (let i = 0; i < len; i++) {
      order.push(i);
    }

    for (let i = 0; i < len; i++) {
      const position = Math.min(len - 1, Math.round(Math.random() * len));
      let tmp = order[i];
      order[i] = order[position];
      order[position] = tmp;
    }

    return order;
  }

}
