import { CardList } from "../state/card-list";
import { Prompt } from "./prompt";
import { GameMessage } from "../../game-error";

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
    public message: GameMessage,
    options?: Partial<ChoosePrizeOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      count: 1,
      allowCancel: false
    }, options);
  }

}
