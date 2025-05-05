import { Prompt } from './prompt';
import { State } from '../state/state';

export class ShuffleDeckPrompt extends Prompt<number[]> {

  readonly type: string = 'Shuffle deck';

  constructor(playerId: number) {
    super(playerId);
  }

  public validate(result: number[] | null, state: State): boolean {
    if (result === null) {
      return false;
    }
    const player = state.players.find(p => p.id === this.playerId);
    if (player === undefined) {
      return false;
    }
    if (result.length !== player.deck.cards.length) {
      return false;
    }
    const s = result.slice();
    s.sort();
    for (let i = 0; i < s.length; i++) {
      if (s[i] !== i) {
        return false;
      }
    }
    return true;
  }

}
