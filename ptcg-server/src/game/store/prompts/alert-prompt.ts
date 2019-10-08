import { Player } from "../state/player";
import { Prompt } from "./prompt";

export class AlertPrompt extends Prompt<void> {

  readonly type: string = 'Alert'

  constructor(player: Player) {
    super(player);
  }

}
