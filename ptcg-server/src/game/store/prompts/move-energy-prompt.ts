import { Card } from "../card/card";
import { Prompt } from "./prompt";
import { PlayerType, SlotType, CardTarget } from "../actions/play-card-action";

export const MoveEnergyPromptType = 'Move energy';

export interface CardTransfer {
  from: CardTarget;
  to: CardTarget;
  card: Card;
}

export interface MoveEnergyOptions {
  allowCancel: boolean;
  moveBasicEnergy: boolean;
  moveSpecialEnergy: boolean;
  maxMoveEnergy: number | undefined;
  maxMoveEnergyCards: number | undefined;
  blockedFrom: CardTarget[];
  blockedTo: CardTarget[];
}

export class MoveEnergyPrompt extends Prompt<CardTransfer[]> {

  readonly type: string = MoveEnergyPromptType;

  public options: MoveEnergyOptions;

  constructor(
    playerId: number,
    public message: string,
    public playerType: PlayerType,
    public slots: SlotType[],
    options?: Partial<MoveEnergyOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      allowCancel: true,
      moveBasicEnergy: true,
      moveSpecialEnergy: true,
      maxMoveEnergy: undefined,
      maxMoveEnergyCards: undefined,
      blockedFrom: [],
      blockedTo: []
    }, options);
  }

}
