import { Prompt } from './prompt';
import { GameMessage } from '../../game-message';

export class InvitePlayerPrompt extends Prompt<string[]> {

  readonly type: string = 'Invite player';

  constructor(playerId: number, public message: GameMessage) {
    super(playerId);
  }

}
