import { Prompt } from "./prompt";
import { GameMessage } from "../../game-error";
import { PokemonCardList } from "../state/pokemon-card-list";

export const ChoosePokemonPromptType = 'Choose pokemon';

export interface ChoosePokemonOptions {
  allowPlayerActive: boolean;
  allowPlayerBench: boolean;
  allowOpponentActive: boolean;
  allowOpponentBench: boolean;
  count: number;
  allowCancel: boolean;
}

export class ChoosePokemonPrompt extends Prompt<PokemonCardList[]> {

  readonly type: string = ChoosePokemonPromptType;

  public options: ChoosePokemonOptions;

  constructor(
    playerId: number,
    public message: GameMessage,
    options?: Partial<ChoosePokemonOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      allowPlayerActive: false,
      allowPlayerBench: true,
      allowOpponentActive: false,
      allowOpponentBench: false,
      count: 1,
      allowCancel: false
    }, options);
  }

}
