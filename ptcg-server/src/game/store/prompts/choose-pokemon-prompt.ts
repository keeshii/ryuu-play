import { Prompt } from "./prompt";
import { GameMessage } from "../../game-error";
import { PlayerType, SlotType } from "../actions/play-card-action";
import { PokemonCardList } from "../state/pokemon-card-list";

export const ChoosePokemonPromptType = 'Choose pokemon';

export interface ChoosePokemonOptions {
  count: number;
  allowCancel: boolean;
}

export class ChoosePokemonPrompt extends Prompt<PokemonCardList[]> {

  readonly type: string = ChoosePokemonPromptType;

  public options: ChoosePokemonOptions;

  constructor(
    playerId: number,
    public message: GameMessage,
    public playerType: PlayerType,
    public slots: SlotType[],
    options?: Partial<ChoosePokemonOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      count: 1,
      allowCancel: true
    }, options);
  }

}
