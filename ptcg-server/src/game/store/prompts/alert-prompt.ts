import { Prompt } from "./prompt";
import { GameMessage } from "../../game-error";

export class AlertPrompt extends Prompt<void> {

  readonly type: string = 'Alert'

  constructor(playerId: number, public message: GameMessage) {
    super(playerId);
  }

}
