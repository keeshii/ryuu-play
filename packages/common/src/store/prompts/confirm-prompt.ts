import { Prompt } from './prompt';
import { GameMessage } from '../../game-message';

export class ConfirmPrompt extends Prompt<boolean> {

  readonly type: string = 'Confirm';

  constructor(playerId: number, public message: GameMessage) {
    super(playerId);
  }

}
