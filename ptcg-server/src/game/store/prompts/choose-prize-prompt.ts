import { CardList } from "../state/card-list";
import { Prompt } from "./prompt";
import { State } from "../state/state";
import { GameError, GameMessage } from "../../game-error";

export const ChoosePrizePromptType = 'Choose prize';

export interface ChoosePrizeOptions {
  count: number;
  allowCancel: boolean;
}

export class ChoosePrizePrompt extends Prompt<CardList[]> {

  readonly type: string = ChoosePrizePromptType;

  public options: ChoosePrizeOptions;

  constructor(
    playerId: number,
    public message: string,
    options?: Partial<ChoosePrizeOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      count: 1,
      allowCancel: false
    }, options);
  }

  public decode(result: number[] | null, state: State): CardList[] | null {
    if (result === null) {
      return result;
    }
    const player = state.players.find(p => p.id === this.playerId);
    if (player === undefined) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    const prizes = player.prizes.filter(p => p.cards.length > 0);
    return result.map(index => prizes[index]);
  }

  public validate(result: CardList[] | null): boolean {
    if (result === null) {
      return this.options.allowCancel;
    }
    if (result.length !== this.options.count) {
      return false;
    }
    const hasDuplicates = result.some((p, index) => {
      return result.indexOf(p) !== index;
    });
    if (hasDuplicates) {
      return false;
    }
    const hasEmpty = result.some(p => p.cards.length === 0);
    if (hasEmpty) {
      return false;
    }
    return true;
  }

}
