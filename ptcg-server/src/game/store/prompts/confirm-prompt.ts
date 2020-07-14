import { Prompt } from "./prompt";

export class ConfirmPrompt extends Prompt<boolean> {

  readonly type: string = 'Confirm'

  constructor(playerId: number, public message: string) {
    super(playerId);
  }

}
