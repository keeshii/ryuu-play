import { Prompt } from './prompt';
import { GameMessage } from '../../game-message';

export class AlertPrompt extends Prompt<true> {

  readonly type: string = 'Alert';

  constructor(playerId: number, public message: GameMessage) {
    super(playerId);
  }

}
