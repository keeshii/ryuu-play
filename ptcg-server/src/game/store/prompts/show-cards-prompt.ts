import { Card } from "../card/card";
import { GameMessage } from "../../game-message";
import { Prompt } from "./prompt";

export class ShowCardsPrompt extends Prompt<void> {

  readonly type: string = 'Show cards'

  constructor(playerId: number, public message: GameMessage, public cards: Card[]) {
    super(playerId);
  }

}
