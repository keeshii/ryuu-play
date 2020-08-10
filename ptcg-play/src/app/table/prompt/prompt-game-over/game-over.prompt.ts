import { Prompt } from 'ptcg-server';

export class GameOverPrompt extends Prompt<void> {

  readonly type: string = 'Game over';

  constructor(playerId: number) {
    super(playerId);
  }

}
