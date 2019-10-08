import { Player } from "../state/player";
import { Prompt } from "./prompt";

export class ConfirmPrompt extends Prompt<boolean> {

  readonly type: string = 'Confirm'

  constructor(player: Player) {
    super(player);
  }

}
