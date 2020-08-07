import { Prompt } from "./prompt";

export class InvitePlayerPrompt extends Prompt<string[]> {

  readonly type: string = 'Invite player'

  constructor(playerId: number, public message: string) {
    super(playerId);
  }

}
