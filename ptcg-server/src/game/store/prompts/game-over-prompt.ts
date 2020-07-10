import { Prompt } from "./prompt";
import { GameWinner } from "../state/state";

export class GameOverPrompt extends Prompt<void> {

  readonly type: string = 'Game over'

  constructor(playerId: number, public winner: GameWinner) {
    super(playerId);
  }

}
