import { Prompt, GameWinner } from 'ptcg-server';

export class GameOverPrompt extends Prompt<void> {

  readonly type: string = 'Game over';

  public winner: GameWinner;

  constructor(playerId: number, winner: GameWinner) {
    super(playerId);
    this.winner = winner;
  }

}
