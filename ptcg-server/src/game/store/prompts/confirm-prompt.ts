import { Player } from "../state/player";
import { Prompt } from "./prompt";
import { StoreMessage } from "../store-messages";

export class ConfirmPrompt extends Prompt<boolean> {

  readonly type: string = 'Confirm'

  constructor(player: Player, public message: StoreMessage) {
    super(player);
  }

}
