import { Card } from "../card/card";
import { CardType } from "../card/card-types";
import { GameMessage } from "../../game-message";
import { Prompt } from "./prompt";
import { StateUtils } from "../state-utils";

export const ChooseEnergyPromptType = 'Choose energy';

export interface ChooseEnergyOptions {
  allowCancel: boolean;
}

export type EnergyMap = { card: Card, provides: CardType[] }

export class ChooseEnergyPrompt extends Prompt<EnergyMap[]> {

  readonly type: string = ChooseEnergyPromptType;

  public options: ChooseEnergyOptions;

  constructor(
    playerId: number,
    public message: GameMessage,
    public energy: EnergyMap[],
    public cost: CardType[],
    options?: Partial<ChooseEnergyOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      allowCancel: true
    }, options);
  }

  public decode(result: number[] | null): EnergyMap[] | null {
    if (result === null) {
      return null;
    }
    const energy: EnergyMap[] = this.energy;
    return result.map(index => energy[index]);
  }

  public validate(result: EnergyMap[] | null): boolean {
    if (result === null) {
      return this.options.allowCancel;
    }
    if (!StateUtils.checkExactEnergy(result, this.cost)) {
      return false;
    }
    return true;
  }

}
