import { Player } from "../state/player";
import { Prompt } from "./prompt";

export class ConfirmPrompt extends Prompt<boolean> {

  readonly type: string = 'Confirm'

  constructor(player: Player, public message: string) {
    super(player);
  }

}
